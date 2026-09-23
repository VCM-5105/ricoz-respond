import { Router } from "express";
import {
  getEvidence,
  getEvidenceByIncident,
  uploadEvidence,
  downloadEvidence
} from "../controllers/evidence.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getEvidence);
router.route("/").post(upload.single("file"), uploadEvidence);
router.route("/incident/:incidentId").get(getEvidenceByIncident);
router.route("/download/:id").get(downloadEvidence);

export default router;
