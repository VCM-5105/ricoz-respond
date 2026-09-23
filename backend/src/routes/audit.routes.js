import { Router } from "express";
import { getAuditLogs } from "../controllers/audit.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAuditLogs);

export default router;
