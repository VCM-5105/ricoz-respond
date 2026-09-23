import mongoose from "mongoose";
import { Timeline } from "../models/timeline.models.js";
import { Incident } from "../models/incident.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getTimelineByIncident = asynchandler(async (req, res) => {
  const { incidentId } = req.params;

  let queryId = incidentId;
  if (!mongoose.Types.ObjectId.isValid(incidentId)) {
    const inc = await Incident.findOne({ incidentId });
    if (!inc) throw new ApiError(404, "Incident not found");
    queryId = inc._id;
  }

  const timeline = await Timeline.find({ incidentId: queryId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        timeline,
        "Incident timeline fetched successfully"
      )
    );
});
