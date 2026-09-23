import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication required");
    }

    const userRoleName = req.user.role?.name || "";
    // If no roles specified or role matches
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRoleName)) {
      throw new ApiError(
        403,
        `Access denied. Role '${userRoleName}' does not have sufficient permissions.`
      );
    }

    next();
  };
};
