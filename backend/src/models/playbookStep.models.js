import mongoose, { Schema } from "mongoose";

const playbookStepSchema = new Schema(
  {
    playbookId: {
      type: Schema.Types.ObjectId,
      ref: "Playbook",
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
    order: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

export const PlaybookStep = mongoose.model("PlaybookStep", playbookStepSchema);
