/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import express from "express";
// import passport from "passport";
import { userValidation } from "../middlewares/requestValidations/users.js";
import { authValidation } from "../middlewares/requestValidations/auth.js";
import { weddingDetailsValidation } from "../middlewares/requestValidations/weddingDetails.js";
import {
  multipleEventsValidation,
  singleEventsValidation,
} from "../middlewares/requestValidations/event.js";
import {
  singleGuestValidation,
  multipleGuestValidation,
} from "../middlewares/requestValidations/guest.js";

import { userController } from "../controllers/users.js";
import { authController } from "../controllers/auth.js";
import { weddingDetailsController } from "../controllers/weddingDetails.js";
import { eventsController } from "../controllers/events.js";
import { guestsController } from "../controllers/guest.js";

import { authAccessToken } from "../middlewares/authorization/accessToken.js";

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

router.get("/authState", authController.authState);

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
  authAccessToken,
  weddingDetailsValidation,
  weddingDetailsController.addDetails,
);

router.get(
  "/weddingDetails",
  authAccessToken,
  weddingDetailsController.getDetails,
);

router.post(
  "/event/single",
  authAccessToken,
  singleEventsValidation,
  eventsController.addSingleEvent,
);

router.post(
  "/event/multiple",
  authAccessToken,
  multipleEventsValidation,
  eventsController.addMultipleEvents,
);

router.get("/event", authAccessToken, eventsController.getAllEvents);

router.patch("/event", authAccessToken, eventsController.updateEvent);

router.delete("/event", authAccessToken, eventsController.deleteEvent);

router.post(
  "/guest/single",
  authAccessToken,
  singleGuestValidation,
  guestsController.addSingleGuest,
);

router.post(
  "/guest/multiple",
  authAccessToken,
  multipleGuestValidation,
  guestsController.addMultipleGuests,
);

router.get("/guest", authAccessToken, guestsController.getAllGuests);

router.patch("/guest", authAccessToken, guestsController.updateGuest);

router.delete("/guest", authAccessToken, guestsController.deleteGuest);

export default router;
