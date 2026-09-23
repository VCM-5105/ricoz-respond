import mongoose, { Schema } from "mongoose";
import { TASK_STATUS } from "../constants.js";

const taskSchema = new Schema(
  {
    incidentId: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Task = mongoose.model("Task", taskSchema);
