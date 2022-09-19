const dotenv = require("dotenv");
dotenv.config();

const APP_PORT = process.env.APP_PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const APP_ENV = process.env.APP_ENV;
const SENTRY_DSN_URL = process.env.SENTRY_DSN_URL;

module.exports = { APP_PORT, APP_ENV, DATABASE_URL, SENTRY_DSN_URL };
