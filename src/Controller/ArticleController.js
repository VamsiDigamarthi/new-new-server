import ArticleModel from "../Modals/ArticleModel.js";
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
    // console.log("articleData", articleData);

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
      "name email role -_id "
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
      publishedDate,
      page,
      pageNumber,
      pageSize,
      subType,
    } = req.query;

    const query = {};

    if (category && category !== "null" && category !== "") {
      query.category = category;
    }
    if (subCategory) query.subCategory = subCategory;
    if (publishedDate) query.publishedDate = publishedDate;
    if (page) query.page = page;
    if (subType) query.subType = subType;

    let articlesQuery = ArticleModel.find(query).sort({ createdAt: -1 });

    if (pageNumber && pageSize) {
      const limit = parseInt(pageSize);
      const skip = (parseInt(pageNumber) - 1) * limit;
      articlesQuery = articlesQuery.skip(skip).limit(limit);
    }

    const articles = await articlesQuery;
    // console.log("articles", articles?.length);

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
