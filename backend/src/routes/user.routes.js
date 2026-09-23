import { Router } from "express";
import {
  getAllUsers,
  getUserById
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById);

export default router;
