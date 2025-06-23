import mongoose from "mongoose";

const adsSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "",
    },
    adSlot: {
      type: String,
      enum: [
        "Homepage Top Banner",
        "Article Sidebar",
        "Middle",
        "Category Footer",
      ],
      default: "Homepage Top Banner",
    },
    tagetPage: {
      type: String,
      enum: [
        "Only Home Page",
        "Only Article Page",
        "Only Category Page",
        "All Pages",
      ],
      default: "Homepage Top Banner",
    },
    articleLink: {
      type: String,
      default: null,
    },
    addType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    status: {
      type: String,
      enum: ["Active", "In-Active", "Scheduled"],
      default: "Active",
    },
    file: {
      type: String,
    },
    targetLink: {
      type: String,
    },
    startDateAndTime: { type: String, required: true },
    endDateAndTime: { type: String, required: true },
    width: { type: String, default: "0px" },
    height: { type: String, default: "0px" },
    dimenstionActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const AdsModel = mongoose.model("Ads", adsSchema);
