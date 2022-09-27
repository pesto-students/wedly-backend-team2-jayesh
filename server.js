import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { init, Integrations, Handlers } from "@sentry/node";
import { Integrations as _Integrations } from "@sentry/tracing";
import { APP_ENV, APP_PORT, SENTRY_DSN_URL } from "./config/index.js";
import routes from "./src/routes/index.js";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

const MongoDBStore = connectMongoDBSession(session);
import passport from "./config/passport/index.js";
import dbConnection from "./config/db/index.js";

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

app.use(
  cors({
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Origin",
    ],
    origin: [`${process.env.CLIENT_APP_URL}`, "http://localhost:7000"],
  }),
);
app.use(json());
app.use(cookieParser());
app.use(
  session({
    store: new MongoDBStore({ mongooseConnection: dbConnection }),
    secret: process.env.APP_SECRET || "this is the default passphrase",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session()); // will call the deserializeUser

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

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on: ${port}`); // eslint-disable-line
});
