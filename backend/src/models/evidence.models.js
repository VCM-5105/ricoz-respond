import mongoose, { Schema } from "mongoose";

const evidenceSchema = new Schema(
  {
    incidentId: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      default: "application/octet-stream"
    },
    fileSize: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ""
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Evidence = mongoose.model("Evidence", evidenceSchema);
