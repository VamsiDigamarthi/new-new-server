import ArticleModel from "../Modals/ArticleModel.js";

export const createArticleService = async (articleData) => {
  const article = new ArticleModel(articleData);
  return await article.save();
};

export const getArticlesService = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    status,
    startDate,
    endDate,
    subCategory,
  } = queryParams;
  console.log("-----", queryParams);
  const query = {};

  // 🔍 Search
  if (search) {
    query.$or = [
      { heading: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  // status === "Active"  status ==="Scheduled"
  // console.log("status", status);

  if (status === "Active" || status === "Scheduled") {
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const now = new Date().toTimeString().split(" ")[0]; // "HH:mm:ss"

    if (status === "Active") {
      query.$or = [
        { publishedDate: { $lt: today } },
        { publishedDate: today, publishedTime: { $lte: now } },
      ];
    } else if (status === "Scheduled") {
      query.$or = [
        { publishedDate: { $gt: today } },
        { publishedDate: today, publishedTime: { $gt: now } },
      ];
    }
  }

  // 📆 Date range filtering
  if (startDate && endDate) {
    query.publishedDate = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    ArticleModel.find(query)
      .populate("author", "name email role -_id location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ArticleModel.countDocuments(query),
  ]);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    articles,
  };
};

export const getArticleSubType = async (queryParams) => {
  const { page, startDate, endDate } = queryParams;

  const query = {};

  if (page) query.page = page;

  if (startDate && endDate) {
    query.publishedDate = {
      $gte: startDate,
      $lte: endDate,
    };
  }
  const distinctSubTypes = await ArticleModel.distinct("subType", {
    ...query,
    subType: { $ne: null, $ne: "" }, // exclude null and empty strings
  });

  return {
    subTypes: distinctSubTypes,
  };
};

export const getAllArticles = async () => {
  return await ArticleModel.find();
};

export const getArticleById = async (id) => {
  return await ArticleModel.findById(id);
};

export const updateArticle = async (id, data) => {
  return await ArticleModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteArticle = async (id) => {
  return await ArticleModel.findByIdAndDelete(id);
};
