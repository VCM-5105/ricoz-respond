import mongoose, { Schema } from "mongoose";

const playbookSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    incidentType: {
      type: String,
      default: "General"
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Playbook = mongoose.model("Playbook", playbookSchema);
