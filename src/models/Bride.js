import mongoose, { Schema } from "mongoose";
const BrideSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    fatherName: {
      required: true,
      type: String,
    },
    motherName: {
      required: true,
      type: String,
    },
    city: {
      required: true,
      type: String,
    },
    state: {
      required: true,
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

export const Bride = mongoose.model("Bride", BrideSchema, "Bride");
