import passport from "passport";
import LocalStrategy from "passport-local";
import { Host } from "../../src/models/Person.js";
import bcrypt from "bcrypt";
import * as Sentry from "@sentry/node";
import generateJWTToken from "../../src/utils/generateJWTToken.js";

const localStrategy = new LocalStrategy(
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

          return done(null, {
            userDetails: payload,
            accessToken,
            refreshToken,
          });
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

passport.use(localStrategy);

export const authenticateUser = async function (req, res, next) {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        Sentry.captureException(err);
        res.status(401).json({ message: err.message });
      } else if (info) {
        res.status(401).json({ message: info });
      } else {
        req.user = user;
        next();
      }
    },
  )(req, res, next);
};
