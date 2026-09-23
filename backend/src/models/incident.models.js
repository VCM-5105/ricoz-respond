import mongoose, { Schema } from "mongoose";
import { INCIDENT_SEVERITY, INCIDENT_STATUS } from "../constants.js";

const incidentSchema = new Schema(
  {
    incidentId: {
      type: String,
      unique: true,
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
    incidentType: {
      type: String,
      default: "Security Incident"
    },
    severity: {
      type: String,
      enum: Object.values(INCIDENT_SEVERITY),
      default: INCIDENT_SEVERITY.MEDIUM
    },
    status: {
      type: String,
      enum: Object.values(INCIDENT_STATUS),
      default: INCIDENT_STATUS.OPEN
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save to auto-generate human-friendly INC-XXXX incidentId if not provided
incidentSchema.pre("save", async function (next) {
  if (!this.incidentId) {
    const count = await mongoose.model("Incident").countDocuments();
    const sequence = (count + 1).toString().padStart(4, "0");
    this.incidentId = `INC-${sequence}`;
  }
  next();
});

export const Incident = mongoose.model("Incident", incidentSchema);
