/* eslint-disable no-console */
import LocalStrategy from "passport-local";
import { Host } from "../../src/models/Host.js";
import bcrypt from "bcrypt";
import * as Sentry from "@sentry/node";
import generateJWTToken from "../../src/utils/generateJWTToken.js";

const strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      let user;
      user = await Host.find({ email });
      // if (!user[0].isVerified) {
      //   return done(null, { message: "Please verify your email to login" });
      // }
      if (user.length === 0) {
        Sentry.captureMessage("Email is not registered", "warning");
        return done(null, { message: "Email is not registered" });
      } else if (!user[0].isVerified) {
        return done(null, { message: "Please verify your email to login" });
      } else {
        if (await bcrypt.compare(password, user[0].local.password)) {
          const payload = user[0];
          payload.local.password = undefined;
          const accessToken = generateJWTToken(payload, "access");
          const refreshToken = generateJWTToken(payload, "refresh");
          return done(null, { payload, accessToken, refreshToken });
        } else {
          return done(null, { message: "Incorrect password" });
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      return done(error);
    }
  },
);

export default strategy;
