import mongoose, { Schema } from "mongoose";

const meetingSchema = new Schema(
  {
    fromId: {
		type: String,
		required: true,
    },
    toId: {
      type: String,
      required: true,
    },
    summary: {
      type: Object,
      required: true,
    },
    schedule: {
      type: Object,
      required: true,
    }
  },
  { timestamps: true }
);

export const Meeting = mongoose.model("Meeting", meetingSchema);
