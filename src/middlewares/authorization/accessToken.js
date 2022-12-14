/* eslint-disable no-console */
import { Host } from "../../models/Host.js";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config/index.js";
import jwt from "jsonwebtoken";
import * as Sentry from "@sentry/node";

export const authAccessToken = async function (req, res, next) {
  if (req.headers.authorization) {
    const accessToken = req.headers.authorization;
    jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET_KEY,
      async (err, userDetails) => {
        try {
          if (err) return res.status(401).json("Invalid token");
          const { payload } = userDetails;
          const user =
            (await Host.findById(payload._id)) ||
            (await Host.find({ "google.googleId": payload.id }));
          if (!user) {
            Sentry.captureMessage("Invalid user details", "warning");
            return res.status(400).json("Invalid user details");
          }
          req.user=user;
          next();
        } catch (e) {
          Sentry.captureException(e);
          return res.status(400).json("Try after sometime");
        }
      },
    );
  } else {
    res
      .status(401)
      .json({ message: "Connection timed out. Please login again." });
  }
};
