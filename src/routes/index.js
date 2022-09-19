import express from "express";
import { userValidation } from "../middlewares/requestValidations/users.js";
import { authValidation } from "../middlewares/requestValidations/auth.js";
import { userController } from "../controllers/users.js";
import { authController } from "../controllers/auth.js";

import { authenticateUser } from "../../config/auth/userPassport.js";

const router = express.Router();

router.post("/signup", userValidation, userController.post);
router.post(
  "/login",
  authValidation,
  authenticateUser,
  authController.authenticate,
);

export default router;
