import { Router } from "express";
import {
  getTasks,
  getTasksByIncident,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getTasks).post(createTask);
router.route("/incident/:incidentId").get(getTasksByIncident);
router.route("/:id").put(updateTask).delete(deleteTask);

export default router;
