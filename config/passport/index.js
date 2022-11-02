/* eslint-disable no-console */
import passport from "passport";
import LocalStrategy from "./localStrategy.js";
import GoogleStratgey from "./googleStrategy.js";
import { Host } from "../../src/models/Host.js";

passport.serializeUser((user, done) => {
  if (user.payload) {
    done(null, { _id: user.payload._id });
  } else {
    done(null, { message: user.message });
  }
});

passport.deserializeUser((id, done) => {
  Host.findOne({ _id: id._id }, (err, user) => {
    if (err) {
      done(null, err);
    } else {
      done(null, user);
    }
  });
});

// ==== Register Strategies ====
passport.use(LocalStrategy);
passport.use(GoogleStratgey);

export default passport;
