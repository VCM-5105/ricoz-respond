import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Role } from "../models/role.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { recordAuditLog } from "../utils/logger.js";

export const registerUser = asynchandler(async (req, res) => {
  const { name, email, password, role: requestedRole } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  // Database-driven role resolution:
  // If role is provided as ObjectId, find it.
  // If role is provided as name string, find or create it.
  // If no role provided, look for default role or create an initial role.
  let roleId = null;

  if (requestedRole) {
    if (mongoose.Types.ObjectId.isValid(requestedRole)) {
      const foundRole = await Role.findById(requestedRole);
      if (foundRole) roleId = foundRole._id;
    }
    
    if (!roleId && typeof requestedRole === "string" && requestedRole.trim()) {
      let roleDoc = await Role.findOne({ name: requestedRole.trim() });
      if (!roleDoc) {
        roleDoc = await Role.create({
          name: requestedRole.trim(),
          description: `Custom ${requestedRole.trim()} role`,
          permissions: ["read", "write"]
        });
      }
      roleId = roleDoc._id;
    }
  }

  // Fallback if no role specified: check if any roles exist in MongoDB
  if (!roleId) {
    let defaultRole = await Role.findOne({ name: "Security Analyst" });
    if (!defaultRole) {
      // First user registration can become Admin or Security Analyst
      const userCount = await User.countDocuments();
      const roleName = userCount === 0 ? "Admin" : "Security Analyst";
      defaultRole = await Role.findOne({ name: roleName });
      if (!defaultRole) {
        defaultRole = await Role.create({
          name: roleName,
          description: userCount === 0 ? "Full platform administrator" : "Tier 1/2 Security Analyst",
          permissions: ["all"]
        });
      }
    }
    roleId = defaultRole._id;
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: roleId
  });

  const createdUser = await User.findById(user._id)
    .select("-password")
    .populate("role");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const token = createdUser.generateAccessToken();

  await recordAuditLog({
    userId: createdUser._id,
    action: "USER_REGISTERED",
    resource: "User",
    details: { email: createdUser.email, role: createdUser.role?.name }
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  return res
    .status(201)
    .cookie("accessToken", token, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: createdUser, token },
        "User registered successfully"
      )
    );
});

export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).populate("role");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id)
    .select("-password")
    .populate("role");

  await recordAuditLog({
    userId: loggedInUser._id,
    action: "USER_LOGIN",
    resource: "User",
    details: { email: loggedInUser.email }
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };

  return res
    .status(200)
    .cookie("accessToken", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, token },
        "User logged in successfully"
      )
    );
});

export const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

export const logoutUser = asynchandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  };

  if (req.user) {
    await recordAuditLog({
      userId: req.user._id,
      action: "USER_LOGOUT",
      resource: "User",
      details: { email: req.user.email }
    });
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
