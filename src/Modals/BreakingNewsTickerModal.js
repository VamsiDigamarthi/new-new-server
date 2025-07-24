// models/BreakingNewsTickerModel.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const breakingNewsTickerSchema = new Schema(
  {
    headline: { type: String, required: true, trim: true },

    subHeadline: { type: String },

    image: { type: String },

    link: { type: String },

    description: { type: String },

    setActiveImmediately: { type: Boolean, default: false },

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

    ticker: {
      type: Number,
      default: 0,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    // startDateAndTime: { type: String, required: true },
    // endDateAndTime: { type: String, required: true },

    startTime: {
      type: String,
      // required: true,
    },

    endTime: {
      type: String,
      // required: true,
    },

    date: {
      type: String,
      required: true,
    },

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
