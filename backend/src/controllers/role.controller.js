import { Role } from "../models/role.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { recordAuditLog } from "../utils/logger.js";

export const getRoles = asynchandler(async (req, res) => {
  const roles = await Role.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, roles, "Roles fetched successfully"));
});

export const createRole = asynchandler(async (req, res) => {
  const { name, description, permissions } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Role name is required");
  }

  const existingRole = await Role.findOne({ name: name.trim() });
  if (existingRole) {
    throw new ApiError(409, "A role with this name already exists");
  }

  const role = await Role.create({
    name: name.trim(),
    description: description || "",
    permissions: Array.isArray(permissions) ? permissions : []
  });

  await recordAuditLog({
    userId: req.user?._id,
    action: "ROLE_CREATED",
    resource: "Role",
    details: { roleName: role.name }
  });

  return res
    .status(201)
    .json(new ApiResponse(201, role, "Role created successfully"));
});
