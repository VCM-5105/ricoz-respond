import { Router } from "express";
import { getTimelineByIncident } from "../controllers/timeline.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/incident/:incidentId").get(getTimelineByIncident);

export default router;
