import mongoose, { Schema } from "mongoose";
const EinviteFirstPageSchema = new mongoose.Schema(
  {
    templateID: {
      type: Number,
    },
    bride: {
      type: String,
    },
    date: {
      type: Date,
    },
    groom: {
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

export const EinviteFirstPage = mongoose.model(
  "EinviteFirstPage",
  EinviteFirstPageSchema,
  "EinviteFirstPage",
);
