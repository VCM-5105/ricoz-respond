import { AuditLog } from "../models/auditLog.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getAuditLogs = asynchandler(async (req, res) => {
  const auditLogs = await AuditLog.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(100);

  return res
    .status(200)
    .json(new ApiResponse(200, auditLogs, "Audit logs fetched successfully"));
});
