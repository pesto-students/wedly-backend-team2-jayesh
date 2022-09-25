import mongoose from "mongoose";
import hashPassword from "../utils/hashPassword.js";

const PersonSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "type",
  },
);

const HostSchema = PersonSchema.discriminator(
  "Host",
  new mongoose.Schema({
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  }),
);

HostSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    throw new Error(error);
  }
});

export const Host = mongoose.model("Host", HostSchema, "Host");
