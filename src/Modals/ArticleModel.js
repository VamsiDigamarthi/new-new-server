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
      type: String,
      default: null,
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

    page: {
      type: String,
    },
    time: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const ArticleModel = mongoose.model("Article", articleSchema);
export default ArticleModel;
