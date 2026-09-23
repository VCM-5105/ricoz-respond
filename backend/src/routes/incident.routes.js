import { Router } from "express";
import {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident
} from "../controllers/incident.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getIncidents).post(createIncident);
router
  .route("/:id")
  .get(getIncidentById)
  .put(updateIncident)
  .delete(deleteIncident);

export default router;
