import { Incident } from "../models/incident.models.js";
import { INCIDENT_SEVERITY, INCIDENT_STATUS } from "../constants.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";

export const getDashboardStats = asynchandler(async (req, res) => {
  // Purely dynamic aggregation from MongoDB
  const [totalIncidents, openIncidents, criticalIncidents, resolvedIncidents] =
    await Promise.all([
      Incident.countDocuments(),
      Incident.countDocuments({ status: INCIDENT_STATUS.OPEN }),
      Incident.countDocuments({ severity: INCIDENT_SEVERITY.CRITICAL }),
      Incident.countDocuments({ status: INCIDENT_STATUS.RESOLVED })
    ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalIncidents,
        openIncidents,
        criticalIncidents,
        resolvedIncidents
      },
      "Dashboard statistics fetched successfully"
    )
  );
});
