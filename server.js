import express, { json } from "express";
import mongoose from "mongoose";
const { connect, connection: _connection } = mongoose;
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { init, Integrations, Handlers } from "@sentry/node";
import { Integrations as _Integrations } from "@sentry/tracing";
import {
  APP_ENV,
  APP_PORT,
  DATABASE_URL,
  SENTRY_DSN_URL,
} from "./config/index.js";

init({
  environment: APP_ENV,
  dsn: SENTRY_DSN_URL,
  integrations: [
    new Integrations.Http({ tracing: true }),
    new _Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

const port = APP_PORT || 7000;
app.use(Handlers.requestHandler());
app.use(Handlers.tracingHandler());

app.use(cors());
app.use(json());
app.use(cookieParser());

const uri = DATABASE_URL;
connect(uri);
const connection = _connection;
connection.once("open", () => {
  console.log("MongoDB Connected"); // eslint-disable-line
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Wedly API",
  });
});

app.use(
  Handlers.errorHandler({
    shouldHandleError(error) {
      if (error.status >= 400) {
        return true;
      }
      return false;
    },
  }),
);

app.listen(port, () => {
  console.log(`Server is running on: ${port}`); // eslint-disable-line
});
