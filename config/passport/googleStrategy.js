import { Host } from "../../src/models/Host.js";
import generateJWTToken from "../../src/utils/generateJWTToken.js";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../index.js";

import GoogleStrategy from "passport-google-oauth20";

const strategy = new GoogleStrategy.Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/google/callback",
  },
  async function (accessToken, refreshToken, profile, done) {
    accessToken = generateJWTToken(profile, "access");
    refreshToken = generateJWTToken(profile, "refresh");
    const existingUser = await Host.findOne({ email: profile.emails[0].value });
    // eslint-disable-next-line no-console
    let payload;
    if (!existingUser) {
      payload = new Host({
        name: profile.displayName,
        email: profile.emails[0].value,
        "google.googleId": profile.id,
        "google.photo": profile.photos[0].value,
        isVerified: true,
      });
      payload.save(function (err, result) {
        if (err) {
          console.log(err); //eslint-disable-line
        } else {
          console.log(result); //eslint-disable-line
        }
      });
    } else {
      payload = existingUser;
    }
    return done(null, {
      payload,
      accessToken,
      refreshToken,
    });
  },
);

export default strategy;