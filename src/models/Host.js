/* eslint-disable no-console */
import mongoose from "mongoose";
import hashPassword from "../utils/hashPassword.js";
import { sendMail } from "../utils/sendMailUtil.js";
import { APP_URL } from "../../config/index.js";

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

HostSchema.post("save", async function (doc) {
  if (doc.email && doc.local) {
    const queryParams = `id=${doc["_id"]}&hashedString=${doc.local.password}`;
    const linkToRedirect = `${APP_URL}/api/verify/mail?${queryParams}`;
    await sendMail(
      doc.email,
      "Wedly Verification Mail",
      "Please verify your email id",
      linkToRedirect,
    );
  }
});

export const Host = mongoose.model("Host", HostSchema, "Host");
