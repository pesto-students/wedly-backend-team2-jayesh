import mongoose, { Schema } from "mongoose";
const EinviteOtherPagesSchema = new mongoose.Schema(
  {
    templateID: {
      type: Number,
    },
    page: {
      type: Number,
    },
    category: {
      type: String,
      enum: ["Engagement", "Sangeet", "Haldi", "Mehendi", "Wedding", "Vidaai"],
    },
    customEvent: {
      type: String,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    venue: {
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

export const EinviteOtherPages = mongoose.model("EinviteOtherPages", EinviteOtherPagesSchema, "EinviteOtherPages");
