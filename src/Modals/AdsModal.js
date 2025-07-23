import mongoose from "mongoose";

const adsSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "",
    },
    adSlot: {
      type: String,
      enum: ["Top Banner", "Article Sidebar", "Middle", "Category Footer"],
      default: "Top Banner",
    },
    tagetPage: {
      type: String,
      enum: [
        "Home",
        "politics",
        "business",
        "tech",
        "sports",
        "cinema",
        "health",
        "career",
        "family",
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

    startDateAndTime: {
      type: String,
      required: true,
      default: () => {
        const now = new Date();
        const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // IST offset
        return istTime.toISOString().replace("T", " ").split(".")[0]; // 'YYYY-MM-DD HH:mm:ss'
      },
    },
    endDateAndTime: {
      type: String,
      required: true,
      default: () => {
        const now = new Date();
        const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
        istTime.setDate(istTime.getDate() + 10); // add 10 days
        return istTime.toISOString().replace("T", " ").split(".")[0];
      },
    },

    width: { type: String, default: "0px" },
    height: { type: String, default: "0px" },
    dimenstionActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const AdsModel = mongoose.model("Ads", adsSchema);
