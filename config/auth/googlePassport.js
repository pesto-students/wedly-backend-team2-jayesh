import passport from "passport";
import { Host } from "../../src/models/Person.js";
import generateJWTToken from "../../src/utils/generateJWTToken.js";

import GoogleStrategy from "passport-google-oauth20";

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      accessToken = generateJWTToken(profile, "access");
      refreshToken = generateJWTToken(profile, "refresh");
      const user = new Host({
        name: profile.displayName,
        email: profile.email,
      });
      user.save(function (err, result) {
        if (err) {
          console.log(err); //eslint-disable-line
        } else {
          console.log(result); //eslint-disable-line
        }
      });

      return done(null, {
        userProfile: profile,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export const authenticateGoogleUser = passport.authenticate("google", {
  scope: ["profile", "email"],
});
