/* eslint-disable no-console */
import passport from "passport";
import LocalStrategy from "./localStrategy.js";
import { Host } from "../../src/models/Person.js";

passport.serializeUser((user, done) => {
  done(null, { _id: user.payload._id });
});

passport.deserializeUser((id, done) => {
  Host.findOne({ _id: id._id }, (err, user) => {
    done(null, user);
  });
});

// ==== Register Strategies ====
passport.use(LocalStrategy);
// use(GoogleStratgey);

export default passport;
