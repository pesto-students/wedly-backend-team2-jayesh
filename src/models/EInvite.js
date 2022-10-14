import mongoose, { Schema } from "mongoose";
const EInviteSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      require: true,
    },
    page1Content: {
      type: String,
    },
    page2Content: {
      type: String,
    },
    page3Content: {
      type: String,
    },
    page4Content: {
      type: String,
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

export const EInvite = mongoose.model("EInvite", EInviteSchema, "EInvite");
