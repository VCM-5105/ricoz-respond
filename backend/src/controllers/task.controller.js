import mongoose from "mongoose";
import { Task } from "../models/task.models.js";
import { Incident } from "../models/incident.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { recordTimeline, recordAuditLog } from "../utils/logger.js";
import { TASK_STATUS } from "../constants.js";

export const getTasks = asynchandler(async (req, res) => {
  const { status, assignedTo } = req.query;
  const query = {};

  if (status && Object.values(TASK_STATUS).includes(status)) {
    query.status = status;
  }
  if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
    query.assignedTo = assignedTo;
  }

  const tasks = await Task.find(query)
    .populate("incidentId", "incidentId title severity status")
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

export const getTasksByIncident = asynchandler(async (req, res) => {
  const { incidentId } = req.params;

  let queryId = incidentId;
  if (!mongoose.Types.ObjectId.isValid(incidentId)) {
    const inc = await Incident.findOne({ incidentId });
    if (!inc) throw new ApiError(404, "Incident not found");
    queryId = inc._id;
  }

  const tasks = await Task.find({ incidentId: queryId })
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === TASK_STATUS.COMPLETED
  ).length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tasks,
        totalTasks,
        completedTasks
      },
      "Incident tasks fetched successfully"
    )
  );
});

export const createTask = asynchandler(async (req, res) => {
  const { incidentId, title, description, status, assignedTo, dueDate } =
    req.body;

  if (!incidentId || !title || !title.trim()) {
    throw new ApiError(400, "Incident ID and task title are required");
  }

  let realIncidentId = incidentId;
  if (!mongoose.Types.ObjectId.isValid(incidentId)) {
    const inc = await Incident.findOne({ incidentId });
    if (!inc) throw new ApiError(404, "Incident not found");
    realIncidentId = inc._id;
  }

  const task = await Task.create({
    incidentId: realIncidentId,
    title: title.trim(),
    description: description || "",
    status: status || TASK_STATUS.TODO,
    assignedTo:
      assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)
        ? assignedTo
        : null,
    dueDate: dueDate ? new Date(dueDate) : null
  });

  const populatedTask = await Task.findById(task._id).populate(
    "assignedTo",
    "name email"
  );

  await recordTimeline({
    incidentId: realIncidentId,
    userId: req.user._id,
    action: "Task created",
    description: `Task "${populatedTask.title}" was created`
  });

  await recordAuditLog({
    userId: req.user._id,
    action: "TASK_CREATED",
    resource: "Task",
    details: { taskId: task._id, title: task.title, incidentId: realIncidentId }
  });

  return res
    .status(201)
    .json(new ApiResponse(201, populatedTask, "Task created successfully"));
});

export const updateTask = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignedTo, dueDate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid task ID format");
  }

  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const oldStatus = task.status;

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (assignedTo !== undefined) {
    task.assignedTo =
      assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)
        ? assignedTo
        : null;
  }
  if (dueDate !== undefined) {
    task.dueDate = dueDate ? new Date(dueDate) : null;
  }

  await task.save();

  const updatedTask = await Task.findById(task._id).populate(
    "assignedTo",
    "name email"
  );

  // Timeline entry when completed or status changed
  if (status && status !== oldStatus) {
    const action =
      status === TASK_STATUS.COMPLETED ? "Task completed" : "Task status changed";
    await recordTimeline({
      incidentId: task.incidentId,
      userId: req.user._id,
      action,
      description: `Task "${task.title}" status changed to ${status}`
    });
  }

  await recordAuditLog({
    userId: req.user._id,
    action: "TASK_UPDATED",
    resource: "Task",
    details: { taskId: task._id, title: task.title, status: task.status }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

export const deleteTask = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid task ID format");
  }

  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Task.findByIdAndDelete(id);

  await recordTimeline({
    incidentId: task.incidentId,
    userId: req.user._id,
    action: "Task deleted",
    description: `Task "${task.title}" was deleted`
  });

  await recordAuditLog({
    userId: req.user._id,
    action: "TASK_DELETED",
    resource: "Task",
    details: { taskId: id, title: task.title }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});
