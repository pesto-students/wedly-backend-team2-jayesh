const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { APP_ENV, APP_PORT, DATABASE_URL, SENTRY_DSN_URL } = require("./config");

Sentry.init({
  environment: APP_ENV,
  dsn: SENTRY_DSN_URL,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

const port = APP_PORT || 7000;
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const uri = DATABASE_URL;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connected");
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Wedly API",
  });
});

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      if (error.status >= 400) {
        return true;
      }
      return false;
    },
  })
);

app.listen(port, () => {
  console.log(`Server is running on: ${port}`);
});
