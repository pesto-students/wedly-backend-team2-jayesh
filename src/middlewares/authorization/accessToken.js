import { Host } from "../../models/Person.js";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config/index.js";
import jwt from "jsonwebtoken";
import * as Sentry from "@sentry/node";

export const authAccessToken = async function (req, res, next) {
  if (req.cookies.accessToken) {
    const accessToken = req.cookies.accessToken.split(" ")[1];
    const refreshToken = req.cookies.refreshToken.split(" ")[1];
    await jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET_KEY,
      async (err, userDetails) => {
        try {
          if (err) res.status(401).json("Invalid token");
          const { payload } = userDetails;
          const user = await Host.findById(payload.id);

          if (!user) {
            Sentry.captureMessage("Invalid user details", "warning");
            res.status(400).json("Invalid user details");
          }

          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          req.user = user;
          next();
        } catch (e) {
          Sentry.captureException(e);
          res.status(400).json("Try after sometime");
        }
      },
    );
  } else {
    res
      .status(401)
      .json({ message: "Connection timed out. Please login again." });
  }
};