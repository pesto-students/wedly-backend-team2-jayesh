/* eslint-disable no-console */
import LocalStrategy from "passport-local";
import { Host } from "../../src/models/Person.js";
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
      if (user.length === 0) {
        Sentry.captureMessage("Email is not registered", "warning");
        return done(null, false, "Email is not registered");
      } else {
        if (await bcrypt.compare(password, user[0].password)) {
          const payload = user[0];
          payload["password"] = undefined;
          const accessToken = generateJWTToken(payload, "access");
          const refreshToken = generateJWTToken(payload, "refresh");
          return done(null, { payload, accessToken, refreshToken });
        } else {
          return done(null, false, "Incorrect password");
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      return done(error);
    }
  },
);

export default strategy;
