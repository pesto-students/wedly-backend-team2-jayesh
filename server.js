/* eslint-disable no-console */
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { init, Integrations, Handlers } from "@sentry/node";
import { Integrations as _Integrations } from "@sentry/tracing";
import {
  CLIENT_APP_URL,
  APP_SECRET,
  APP_ENV,
  PORT,
  SENTRY_DSN_URL,
  DATABASE_URL,
} from "./config/index.js";
import routes from "./src/routes/index.js";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import mongoose from "mongoose";

const MongoDBStore = connectMongoDBSession(session);
import passport from "./config/passport/index.js";
// import dbConnection from "./config/db/index.js";

init({
  environment: APP_ENV,
  dsn: SENTRY_DSN_URL,
  integrations: [
    new Integrations.Http({ tracing: true }),
    new _Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

const port = PORT || 7000;
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
    origin: [
      `${CLIENT_APP_URL}`,
      "http://localhost:7000",
      "https://wedly-backend.herokuapp.com/",
    ],
  }),
);
app.use(json());
app.use(cookieParser());
app.use(
  session({
    store: new MongoDBStore({
      uri: DATABASE_URL,
      databaseName: "test",
      collection: "session",
    }),
    secret: APP_SECRET || "this is the default passphrase",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
    },
  }),
);

mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(`There was an error connecting to the database: ${err}`);
});
db.once("open", () => {
  console.log(`You have successfully connected to your mongo database`);
});

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
