import mongoose, { Schema } from "mongoose";
const EventSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Engagement", "Sangeet", "Haldi", "Mehendi", "Wedding", "Vidaai"],
    },
    customEvent: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
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

export const Event = mongoose.model("Event", EventSchema, "Event");
