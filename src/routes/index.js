/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import express from "express";
// import passport from "passport";
import { userValidation } from "../middlewares/requestValidations/users.js";
import { authValidation } from "../middlewares/requestValidations/auth.js";
import { userController } from "../controllers/users.js";
import { authController } from "../controllers/auth.js";
// import { authAccessToken } from "../middlewares/authorization/accessToken.js";
import { weddingDetailsController } from "../controllers/weddingDetails.js";
import { weddingDetailsValidation } from "../middlewares/requestValidations/weddingDetails.js";
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

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/google/failed",
  }),
  authController.authenticateGoogleUser,
);

router.get("/google/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: false,
      message: "Success",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

router.get("/google/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Failure",
  });
});

router.get("/google/logout", authController.logoutGoogleUser);

router.post(
  "/weddingDetails",
  weddingDetailsValidation,
  // authAccessToken,
  weddingDetailsController.addDetails,
);

export default router;
