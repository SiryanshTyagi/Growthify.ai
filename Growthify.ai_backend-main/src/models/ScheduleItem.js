import mongoose from "mongoose";

const scheduleItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["scheduled", "unscheduled"],
      default: "scheduled",
      index: true,
    },
    date: {
      type: String,
      default: "",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ScheduleItem", scheduleItemSchema);
