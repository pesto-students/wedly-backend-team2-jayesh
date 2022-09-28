import mongoose from "mongoose";
import hashPassword from "../utils/hashPassword.js";

const HostSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    local: {
      password: {
        type: String,
      },
    },
    google: {
      googleId: { type: String },
      photo: { type: String },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

HostSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("local.password")) return next();
    this.local.password = await hashPassword(this.local.password);
    next();
  } catch (error) {
    throw new Error(error);
  }
});

export const Host = mongoose.model("Host", HostSchema, "Host");
