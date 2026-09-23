import { Router } from "express";
import { getRoles, createRole } from "../controllers/role.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Allow GET /api/roles publicly so registration page can fetch available roles without token
router.route("/").get(getRoles);
router.route("/").post(verifyJWT, createRole);

export default router;
