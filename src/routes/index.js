import express from "express";
import passport from "passport";
import { userValidation } from "../middlewares/requestValidations/users.js";
import { authValidation } from "../middlewares/requestValidations/auth.js";
import { userController } from "../controllers/users.js";
import { authController } from "../controllers/auth.js";

import { authenticateUser } from "../../config/auth/userPassport.js";
import { authenticateGoogleUser } from "../../config/auth/googlePassport.js";

const router = express.Router();

router.post("/signup", userValidation, userController.post);
router.post(
  "/login",
  authValidation,
  authenticateUser,
  authController.authenticate,
);
// router.post("/logout", (req, res) => {
//   // console.log(req);
//   // req.session.destroy();
//   // req.logout(function (err) {
//   //   if (err) {
//   //     // eslint-disable-next-line no-console
//   //     console.log(err);
//   //   }

//   //   res.clearCookie("refreshToken");
//   //   res.redirect("/");
//   // });
// });

router.get("/google/success", (req, res) => {
  if (req.user) {
    res.status(200).cookie("googleSession", req.cookies).json({
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

router.get("/google", authenticateGoogleUser);
router.get("/google/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.clearCookie("googleSession");
    req.session.destroy();
    res.redirect("http://localhost:3000");
  });
});
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "/google/failed",
  }),
);

export default router;
