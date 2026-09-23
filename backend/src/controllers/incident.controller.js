import mongoose from "mongoose";
import { Incident } from "../models/incident.models.js";
import { User } from "../models/user.models.js";
import { Task } from "../models/task.models.js";
import { Evidence } from "../models/evidence.models.js";
import { Timeline } from "../models/timeline.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { recordTimeline, recordAuditLog } from "../utils/logger.js";
import { INCIDENT_SEVERITY, INCIDENT_STATUS } from "../constants.js";

export const getIncidents = asynchandler(async (req, res) => {
  const { search, severity, status, assignedTo } = req.query;

  const query = {};

  if (severity && Object.values(INCIDENT_SEVERITY).includes(severity)) {
    query.severity = severity;
  }

  if (status && Object.values(INCIDENT_STATUS).includes(status)) {
    query.status = status;
  }

  if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
    query.assignedTo = assignedTo;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { incidentId: searchRegex },
      { incidentType: searchRegex }
    ];
  }

  const incidents = await Incident.find(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, incidents, "Incidents fetched successfully"));
});

export const getIncidentById = asynchandler(async (req, res) => {
  const { id } = req.params;

  let query = {};
  if (mongoose.Types.ObjectId.isValid(id)) {
    query._id = id;
  } else {
    query.incidentId = id;
  }

  const incident = await Incident.findOne(query)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!incident) {
    throw new ApiError(404, "Incident not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, incident, "Incident fetched successfully"));
});

export const createIncident = asynchandler(async (req, res) => {
  const { title, description, incidentType, severity, status, assignedTo } =
    req.body;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Incident title is required");
  }

  let assignedUserId = null;
  if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
    const userExists = await User.findById(assignedTo);
    if (userExists) {
      assignedUserId = userExists._id;
    }
  }

  const incident = await Incident.create({
    title: title.trim(),
    description: description || "",
    incidentType: incidentType || "Security Incident",
    severity: severity || INCIDENT_SEVERITY.MEDIUM,
    status: status || INCIDENT_STATUS.OPEN,
    assignedTo: assignedUserId,
    createdBy: req.user._id
  });

  const createdIncident = await Incident.findById(incident._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  // Create timeline and audit log entries
  await recordTimeline({
    incidentId: createdIncident._id,
    userId: req.user._id,
    action: "Incident created",
    description: `Incident [${createdIncident.incidentId}] "${createdIncident.title}" was created by ${req.user.name}`
  });

  await recordAuditLog({
    userId: req.user._id,
    action: "INCIDENT_CREATED",
    resource: "Incident",
    details: {
      incidentId: createdIncident.incidentId,
      title: createdIncident.title,
      severity: createdIncident.severity
    }
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdIncident, "Incident created successfully")
    );
});

export const updateIncident = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, incidentType, severity, status, assignedTo } =
    req.body;

  let query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { incidentId: id };

  const incident = await Incident.findOne(query);
  if (!incident) {
    throw new ApiError(404, "Incident not found");
  }

  const oldStatus = incident.status;
  const oldAssignedTo = incident.assignedTo?.toString();

  if (title !== undefined) incident.title = title.trim();
  if (description !== undefined) incident.description = description;
  if (incidentType !== undefined) incident.incidentType = incidentType;
  if (severity !== undefined) incident.severity = severity;
  if (status !== undefined) incident.status = status;

  if (assignedTo !== undefined) {
    if (!assignedTo) {
      incident.assignedTo = null;
    } else if (mongoose.Types.ObjectId.isValid(assignedTo)) {
      incident.assignedTo = assignedTo;
    }
  }

  await incident.save();

  const updatedIncident = await Incident.findById(incident._id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  // Log timeline for status changes
  if (status && status !== oldStatus) {
    await recordTimeline({
      incidentId: updatedIncident._id,
      userId: req.user._id,
      action: "Status changed",
      description: `Incident status updated from ${oldStatus} to ${status}`
    });
  }

  // Log timeline for assignment changes
  if (
    assignedTo !== undefined &&
    updatedIncident.assignedTo?._id?.toString() !== oldAssignedTo
  ) {
    const assigneeName = updatedIncident.assignedTo?.name || "Unassigned";
    await recordTimeline({
      incidentId: updatedIncident._id,
      userId: req.user._id,
      action: "Incident assigned",
      description: `Incident assigned to ${assigneeName}`
    });
  }

  await recordAuditLog({
    userId: req.user._id,
    action: "INCIDENT_UPDATED",
    resource: "Incident",
    details: {
      incidentId: updatedIncident.incidentId,
      changes: req.body
    }
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedIncident, "Incident updated successfully")
    );
});

export const deleteIncident = asynchandler(async (req, res) => {
  const { id } = req.params;

  let query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { incidentId: id };

  const incident = await Incident.findOne(query);
  if (!incident) {
    throw new ApiError(404, "Incident not found");
  }

  // Delete associated tasks, evidence, timeline
  await Promise.all([
    Task.deleteMany({ incidentId: incident._id }),
    Evidence.deleteMany({ incidentId: incident._id }),
    Timeline.deleteMany({ incidentId: incident._id }),
    Incident.findByIdAndDelete(incident._id)
  ]);

  await recordAuditLog({
    userId: req.user._id,
    action: "INCIDENT_DELETED",
    resource: "Incident",
    details: {
      incidentId: incident.incidentId,
      title: incident.title
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Incident deleted successfully"));
});
