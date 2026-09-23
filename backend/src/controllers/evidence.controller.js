import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { Evidence } from "../models/evidence.models.js";
import { Incident } from "../models/incident.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { recordTimeline, recordAuditLog } from "../utils/logger.js";

export const getEvidence = asynchandler(async (req, res) => {
  const evidenceList = await Evidence.find()
    .populate("incidentId", "incidentId title severity")
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, evidenceList, "All evidence fetched successfully")
    );
});

export const getEvidenceByIncident = asynchandler(async (req, res) => {
  const { incidentId } = req.params;

  let queryId = incidentId;
  if (!mongoose.Types.ObjectId.isValid(incidentId)) {
    const inc = await Incident.findOne({ incidentId });
    if (!inc) throw new ApiError(404, "Incident not found");
    queryId = inc._id;
  }

  const evidence = await Evidence.find({ incidentId: queryId })
    .populate("uploadedBy", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, evidence, "Incident evidence fetched successfully")
    );
});

export const uploadEvidence = asynchandler(async (req, res) => {
  const { incidentId, description } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Evidence file is required");
  }

  if (!incidentId) {
    throw new ApiError(400, "Incident ID is required");
  }

  let realIncidentId = incidentId;
  if (!mongoose.Types.ObjectId.isValid(incidentId)) {
    const inc = await Incident.findOne({ incidentId });
    if (!inc) throw new ApiError(404, "Incident not found");
    realIncidentId = inc._id;
  }

  const evidence = await Evidence.create({
    incidentId: realIncidentId,
    filename: req.file.filename,
    originalName: req.file.originalname,
    filePath: req.file.path,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    description: description || "",
    uploadedBy: req.user._id
  });

  const populatedEvidence = await Evidence.findById(evidence._id).populate(
    "uploadedBy",
    "name email"
  );

  await recordTimeline({
    incidentId: realIncidentId,
    userId: req.user._id,
    action: "Evidence uploaded",
    description: `Evidence file "${req.file.originalname}" was uploaded by ${req.user.name}`
  });

  await recordAuditLog({
    userId: req.user._id,
    action: "EVIDENCE_UPLOADED",
    resource: "Evidence",
    details: {
      evidenceId: evidence._id,
      filename: req.file.originalname,
      incidentId: realIncidentId
    }
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedEvidence,
        "Evidence uploaded successfully"
      )
    );
});

export const downloadEvidence = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid evidence ID format");
  }

  const evidence = await Evidence.findById(id);
  if (!evidence) {
    throw new ApiError(404, "Evidence not found");
  }

  const absolutePath = path.resolve(evidence.filePath);
  if (!fs.existsSync(absolutePath)) {
    throw new ApiError(404, "File not found on server disk");
  }

  return res.download(absolutePath, evidence.originalName);
});
