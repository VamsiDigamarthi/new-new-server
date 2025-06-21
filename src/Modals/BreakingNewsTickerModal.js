// models/BreakingNewsTickerModel.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const breakingNewsTickerSchema = new Schema(
  {
    headline: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "politics",
        "tech",
        "cinema",
        "business",
        "sports",
        "health",
        "career",
      ],
      // required: true,
      // trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    startDateAndTime: { type: Date, required: true },
    endDateAndTime: { type: Date, required: true },
    link: { type: String },
    setActiveImmediately: { type: Boolean, default: false },

    displayOptions: {
      showCategory: { type: Boolean, default: true },
      flashHighPriority: { type: Boolean, default: false },
      authorize: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ["Active", "Scheduled"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

const BreakingNewsTickerModel = mongoose.model(
  "BreakingNewsTicker",
  breakingNewsTickerSchema
);
export default BreakingNewsTickerModel;
