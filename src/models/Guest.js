import mongoose, { Schema } from "mongoose";
const GuestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    isInvited: {
      type: Boolean,
      default: false,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "Host",
    },
  },
  {
    timestamps: true,
  },
);

export const Guest = mongoose.model("Guest", GuestSchema, "Guest");
