import { Router } from "express";
import {
  getPlaybooks,
  getPlaybookById,
  createPlaybook,
  addPlaybookStep,
  executePlaybook
} from "../controllers/playbook.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getPlaybooks).post(createPlaybook);
router.route("/:id").get(getPlaybookById);
router.route("/:id/steps").post(addPlaybookStep);
router.route("/:id/execute").post(executePlaybook);

export default router;
