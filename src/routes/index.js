/* eslint-disable no-console */
import express from "express";
// import passport from "passport";
import { userValidation } from "../middlewares/requestValidations/users.js";
import { authValidation } from "../middlewares/requestValidations/auth.js";
import { userController } from "../controllers/users.js";
import { authController } from "../controllers/auth.js";
const router = express.Router();
import passport from "../../config/passport/index.js";

router.post("/signup", userValidation, userController.post);

router.post(
  "/login",
  authValidation,
  passport.authenticate("local"),
  authController.authenticateUser,
);

router.post("/logout", authController.logout);
export default router;
