import { Timeline } from "../models/timeline.models.js";
import { AuditLog } from "../models/auditLog.models.js";

export const recordTimeline = async ({ incidentId, userId, action, description }) => {
  try {
    if (!incidentId || !action) return null;
    const timelineEntry = await Timeline.create({
      incidentId,
      userId,
      action,
      description: description || ""
    });
    return timelineEntry;
  } catch (error) {
    console.error("Error creating timeline record:", error.message);
    return null;
  }
};

export const recordAuditLog = async ({ userId, action, resource, details }) => {
  try {
    if (!action || !resource) return null;
    const auditEntry = await AuditLog.create({
      userId: userId || null,
      action,
      resource,
      details: details || {}
    });
    return auditEntry;
  } catch (error) {
    console.error("Error creating audit log record:", error.message);
    return null;
  }
};
