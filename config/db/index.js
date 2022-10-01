/* eslint-disable no-console */
import mongoose from "mongoose";
import { DATABASE_URL } from "../index.js";
mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL);

// should mongoose.connection be put in the call back of mongoose.connect???
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(`There was an error connecting to the database: ${err}`);
});
db.once("open", () => {
  console.log(`You have successfully connected to your mongo database`);
});

export default db;
