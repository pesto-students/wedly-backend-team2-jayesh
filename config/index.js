import dotenv from "dotenv";
dotenv.config();

export const {
  CLIENT_APP_URL,
  APP_SECRET,
  PORT,
  APP_ENV,
  DATABASE_URL,
  SENTRY_DSN_URL,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;
