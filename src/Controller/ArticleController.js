import ArticleModel from "../Modals/ArticleModel.js";
import moment from "moment-timezone";
import {
  createArticleService,
  getArticlesService,
  getArticleSubType,
} from "../Service/ArticleService.js";
import logger from "../Utils/logger.js";
import { sendResponse } from "../Utils/sendResponse.js";

export const createArticleController = async (req, res) => {
  logger.info(`ARTICLE APIhit `);
  try {
    const articleData = {
      ...req.body,
      image: req.file?.path || null,
    };
    console.log("articleData", articleData);

    await createArticleService(articleData);

    return sendResponse(res, 200, "Article created successfully");
  } catch (error) {
    logger.error(`❌Article Upload Failed : ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "User Login Faield", error);
  }
};

export const getArticlesController = async (req, res) => {
  logger.info("📄 Get Articles API hit");
  try {
    const result = await getArticlesService(req.query);

    return sendResponse(
      res,
      200,
      "Articles fetched successfully",
      null,
      result
    );
  } catch (error) {
    logger.error("❌ Failed to fetch articles", { error: error.message });
    return sendResponse(res, 500, "Internal Server Error", error.message);
  }
};

export const getSingleArticlesController = async (req, res) => {
  logger.info("📄 Get Single Articles API hit");
  const { page, id } = req.params;
  try {
    const art = await ArticleModel.findOne({ _id: id }).populate(
      "author",
      "name email role -_id location"
    );
    return res.status(200).json(art);
  } catch (error) {
    logger.error("❌ Failed to fetch articles", { error: error.message });
    return sendResponse(res, 500, "Internal Server Error", error.message);
  }
};

export const getArticlesSubTypeController = async (req, res) => {
  logger.info("ARTICLE SUB TYPE API");
  try {
    const { subTypes } = await getArticleSubType(req.query);
    // console.log("result", subTypes);

    return res.status(200).json(subTypes);
  } catch (error) {
    logger.error("❌ Failed to fetch articles", { error: error.message });
    return sendResponse(res, 500, "Internal Server Error", error.message);
  }
};

export const getArticlesControllerToNewsWeb = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      page,
      pageNumber,
      pageSize,
      subType,
      managerNews = false,
    } = req.query;

    const query = { managerNews, isApproved: true };

    // Handle managerNews filter
    if (managerNews === "true") {
      query.managerNews = true;
    } else if (managerNews === "false") {
      query.managerNews = false;
    }

    // Handle other filters
    if (category && category !== "null" && category !== "") {
      query.category = category;
    }
    if (subCategory) query.subCategory = subCategory;
    if (page) query.page = page;

    if (subType) query.subType = subType;

    // Get current IST time
    const currentUTC = new Date();
    const ISTOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const currentIST = new Date(currentUTC.getTime() + ISTOffset);
    const currentDate = currentIST.toISOString().split("T")[0]; // e.g., 2025-07-24
    const currentTime = currentIST.toISOString().split("T")[1].slice(0, 8); // e.g., 09:40:00

    // Filter for past data only
    // query.publishedDate = { $lte: currentDate };
    query.$or = [
      { publishedDate: { $lt: currentDate } }, // Past dates
      { publishedDate: currentDate, publishedTime: { $lte: currentTime } }, // Today, past or current time
    ];

    // Build query with sorting
    let articlesQuery = ArticleModel.find(query)
      .populate("author", "name email role -_id location")
      .sort({ createdAt: -1 });

    // Handle pagination
    if (pageNumber && pageSize) {
      const limit = parseInt(pageSize);
      const skip = (parseInt(pageNumber) - 1) * limit;
      articlesQuery = articlesQuery.skip(skip).limit(limit);
    }

    const articles = await articlesQuery;
    console.log("articles", articles);

    return res.status(200).json(articles);
  } catch (error) {
    logger.error("❌ Failed to fetch web-site articles", {
      error: error.message,
    });
    return sendResponse(
      res,
      500,
      "Failed to fetch web-site articles",
      error.message
    );
  }
};

export const getTopNewsByCategory = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {
          subCategory: "Top News",
          // status: "published",
        },
      },
      {
        $sort: {
          publishedDate: -1, // latest first
        },
      },
      {
        $group: {
          _id: "$category", // group by category
          article: { $first: "$$ROOT" }, // take the latest article per category
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          article: "$article",
        },
      },
    ];

    const articles = await ArticleModel.aggregate(pipeline);

    // Format result as { category: article }
    const result = {};
    for (const item of articles) {
      result[item.category] = item.article;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const deletArticle = async (req, res) => {
  const { id } = req.params;
  try {
    await ArticleModel.findByIdAndDelete(id);
    return res.status(204).json({ message: "Deleted...!" });
  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateArticle = async (req, res) => {
  const { id } = req.params;
  console.log("--", req.body);
  try {
    const updates = {};

    // If you're using multer for file upload, handle image separately
    if (req.file) {
      updates.image = req.file.path; // or req.file.filename if you store only filename
    }

    // Handle form fields
    const fields = [
      "headline",
      "subCategory",
      "content",
      "image",
      "publishedDate",
      "publishedTime",
    ];

    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const getFutureArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      startDate, // format: YYYY-MM-DD
      endDate, // format: YYYY-MM-DD
    } = req.query;

    let filter = {};
    console.log("startDate", startDate);

    if (startDate && endDate) {
      filter.publishedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      const now = new Date();
      const todayDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().split(" ")[0];

      filter.$or = [
        { publishedDate: { $gt: todayDate } },
        {
          publishedDate: todayDate,
          publishedTime: { $gt: currentTime },
        },
      ];
    }

    // 🔍 Add search on headline or subHeadline
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$and = [
        {
          $or: [{ headline: searchRegex }, { subHeadline: searchRegex }],
        },
      ];
    }

    // 🏷️ Category filter
    if (category) {
      filter.category = category;
    }
    console.log("filter", filter);

    const skip = (page - 1) * limit;
    const articles = await ArticleModel.find(filter)
      .sort({
        publishedDate: 1,
        publishedTime: 1,
      })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      page: Number(page),
      pages: Math.ceil(articles?.length / limit),
      data: articles,
    });
  } catch (error) {
    console.error("Error fetching future articles:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const incrementViewCount = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);

  try {
    const article = await ArticleModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // increment view by 1
      { new: true }
    );
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approvedArt = async (req, res) => {
  const { id } = req.params;
  try {
    await ArticleModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isApproved: true,
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: "Approved...!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
