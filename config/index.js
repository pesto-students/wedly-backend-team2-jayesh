import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  APP_ENV,
  DATABASE_URL,
  SENTRY_DSN_URL,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} = process.env;
