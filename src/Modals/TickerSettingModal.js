import mongoose from "mongoose";

const tickerSettingSchema = new mongoose.Schema(
  {
    speed: {
      type: String,
      enum: ["slow", "medium", "fast"],
      default: "medium",
    },

    showCategory: {
      type: Boolean,
      default: false,
    },

    flashHighPriority: {
      type: Boolean,
      default: false,
    },

    autoRotate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TickerSettingModel = mongoose.model(
  "TickerSetting",
  tickerSettingSchema
);
