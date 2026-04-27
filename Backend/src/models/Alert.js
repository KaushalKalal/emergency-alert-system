
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "Not provided",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
    classifiedBy: {
      type: String,
      enum: ["AI", "rules"],
      default: "rules",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);