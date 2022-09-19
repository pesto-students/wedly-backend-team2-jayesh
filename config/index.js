import dotenv from "dotenv";
dotenv.config();

export const { APP_PORT, APP_ENV, DATABASE_URL, SENTRY_DSN_URL } = process.env;
