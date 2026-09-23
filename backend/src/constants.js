export const DB_NAME = process.env.DB_NAME || "ricoz_respond_testing";

export const INCIDENT_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
};

export const INCIDENT_STATUS = {
  OPEN: "OPEN",
  INVESTIGATING: "INVESTIGATING",
  CONTAINED: "CONTAINED",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED"
};

export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED"
};
