import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Incident } from "../models/incident.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getAllUsers = asynchandler(async (req, res) => {
  const users = await User.find()
    .select("-password")
    .populate("role")
    .sort({ createdAt: -1 });

  // Dynamically calculate active incidents for each user directly from MongoDB
  const usersWithActiveCount = await Promise.all(
    users.map(async (user) => {
      const activeIncidentsCount = await Incident.countDocuments({
        assignedTo: user._id,
        status: { $in: ["OPEN", "INVESTIGATING", "CONTAINED"] }
      });
      return {
        ...user.toObject(),
        activeIncidents: activeIncidentsCount
      };
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        usersWithActiveCount,
        "Users fetched successfully"
      )
    );
});

export const getUserById = asynchandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  const user = await User.findById(id).select("-password").populate("role");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});
