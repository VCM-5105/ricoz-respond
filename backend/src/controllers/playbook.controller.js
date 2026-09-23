import mongoose from "mongoose";
import { Playbook } from "../models/playbook.models.js";
import { PlaybookStep } from "../models/playbookStep.models.js";
import { Incident } from "../models/incident.models.js";
import { Task } from "../models/task.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { recordTimeline, recordAuditLog } from "../utils/logger.js";
import { TASK_STATUS } from "../constants.js";

export const getPlaybooks = asynchandler(async (req, res) => {
  const playbooks = await Playbook.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  // Dynamically count steps for each playbook
  const playbooksWithStepCounts = await Promise.all(
    playbooks.map(async (pb) => {
      const stepCount = await PlaybookStep.countDocuments({
        playbookId: pb._id
      });
      return {
        ...pb.toObject(),
        stepCount
      };
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playbooksWithStepCounts,
        "Playbooks fetched successfully"
      )
    );
});

export const getPlaybookById = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid playbook ID format");
  }

  const playbook = await Playbook.findById(id).populate(
    "createdBy",
    "name email"
  );
  if (!playbook) {
    throw new ApiError(404, "Playbook not found");
  }

  const steps = await PlaybookStep.find({ playbookId: playbook._id }).sort({
    order: 1
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...playbook.toObject(),
        steps
      },
      "Playbook fetched successfully"
    )
  );
});

export const createPlaybook = asynchandler(async (req, res) => {
  const { name, description, incidentType, steps } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Playbook name is required");
  }

  const playbook = await Playbook.create({
    name: name.trim(),
    description: description || "",
    incidentType: incidentType || "General",
    createdBy: req.user?._id || null
  });

  let createdSteps = [];
  if (Array.isArray(steps) && steps.length > 0) {
    const stepDocs = steps.map((step, index) => ({
      playbookId: playbook._id,
      title: step.title || `Step ${index + 1}`,
      description: step.description || "",
      order: step.order !== undefined ? step.order : index + 1
    }));
    createdSteps = await PlaybookStep.insertMany(stepDocs);
  }

  await recordAuditLog({
    userId: req.user?._id,
    action: "PLAYBOOK_CREATED",
    resource: "Playbook",
    details: {
      playbookId: playbook._id,
      name: playbook.name,
      stepsCount: createdSteps.length
    }
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        ...playbook.toObject(),
        steps: createdSteps
      },
      "Playbook created successfully"
    )
  );
});

export const addPlaybookStep = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, order } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid playbook ID format");
  }

  const playbook = await Playbook.findById(id);
  if (!playbook) {
    throw new ApiError(404, "Playbook not found");
  }

  if (!title || !title.trim()) {
    throw new ApiError(400, "Step title is required");
  }

  const existingStepsCount = await PlaybookStep.countDocuments({
    playbookId: id
  });

  const step = await PlaybookStep.create({
    playbookId: id,
    title: title.trim(),
    description: description || "",
    order: order !== undefined ? order : existingStepsCount + 1
  });

  return res
    .status(201)
    .json(new ApiResponse(201, step, "Playbook step added successfully"));
});

export const executePlaybook = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { incidentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid playbook ID format");
  }

  if (!incidentId) {
    throw new ApiError(400, "Incident ID is required to execute playbook");
  }

  let realIncidentId = incidentId;
  if (!mongoose.Types.ObjectId.isValid(incidentId)) {
    const inc = await Incident.findOne({ incidentId });
    if (!inc) throw new ApiError(404, "Incident not found");
    realIncidentId = inc._id;
  }

  // 1. Retrieve the playbook and its steps from MongoDB
  const playbook = await Playbook.findById(id);
  if (!playbook) {
    throw new ApiError(404, "Playbook not found");
  }

  const steps = await PlaybookStep.find({ playbookId: id }).sort({ order: 1 });

  // 2. Create tasks based on the actual playbook steps in MongoDB
  const createdTasks = [];
  for (const step of steps) {
    const task = await Task.create({
      incidentId: realIncidentId,
      title: `[Playbook: ${playbook.name}] ${step.title}`,
      description: step.description || `Executed from playbook: ${playbook.name}`,
      status: TASK_STATUS.TODO,
      assignedTo: req.user?._id || null
    });
    createdTasks.push(task);
  }

  // 3. Create a timeline entry in MongoDB
  await recordTimeline({
    incidentId: realIncidentId,
    userId: req.user._id,
    action: "Playbook executed",
    description: `Executed playbook "${playbook.name}" generating ${createdTasks.length} response task(s)`
  });

  // 4. Create an audit log entry in MongoDB
  await recordAuditLog({
    userId: req.user._id,
    action: "PLAYBOOK_EXECUTED",
    resource: "Playbook",
    details: {
      playbookId: playbook._id,
      playbookName: playbook.name,
      incidentId: realIncidentId,
      generatedTasksCount: createdTasks.length
    }
  });

  // 5. Return updated tasks & execution state
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        playbook,
        generatedTasks: createdTasks,
        tasksCount: createdTasks.length
      },
      `Playbook "${playbook.name}" executed successfully. ${createdTasks.length} task(s) created.`
    )
  );
});
