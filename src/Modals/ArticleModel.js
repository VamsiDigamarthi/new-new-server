import mongoose from "mongoose";
const { Schema } = mongoose;

const mediaSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
});

const articleSchema = new Schema(
  {
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    subHeadline: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        // "Home",
        "politics",
        "tech",
        "career",
        "cinema",
        "business",
        "sports",
        "health",
        "family",
        "news",
        "lifestyle",
        "education",
        "home",
        "gallery",
      ],
    },
    subCategory: {
      type: String,
      enum: [
        "Top Stories",
        "Top News",
        "Editor Choice",
        "Breaking News",
        "Latest News",
        "Insta Viral News",
        "sports sub",
        "health sub",
        "business sub",
        "cinema sub",
        "tech sub",
        "politics sub",
      ],
    },
    subType: {
      type: String,
      trim: true,
      default: null,
    },
    publishedDate: {
      type: String,
      required: true,
      default: () => new Date().toISOString().split("T")[0],
    },
    publishedTime: {
      type: String,
      required: true,
      default: () => new Date().toTimeString().split(" ")[0],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    extraMedia: {
      type: [mediaSchema],
      default: [],
    },

    newsType: {
      type: String,
      enum: ["article", "videogallery", "imagegallery"],
      defaule: "article",
      // required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Scheduled"],
      default: "Scheduled",
    },

    date: {
      type: String,
      default: null,
    },

    startTime: {
      type: String,
      default: null,
    },

    endTime: {
      type: String,
      default: null,
    },

    page: {
      type: String,
    },
    time: {
      type: String,
    },
    managerNews: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ArticleModel = mongoose.model("Article", articleSchema);
export default ArticleModel;
