import mongoose from "mongoose";
import hashPassword from "../utils/hashPassword.js";

const PersonSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
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
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
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

export const Host = mongoose.model("Host", HostSchema);
