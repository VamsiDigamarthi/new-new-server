import BreakingNewsTickerModel from "../Modals/BreakingNewsTickerModal.js";
import { TickerSettingModel } from "../Modals/TickerSettingModal.js";

export const createBreakingNewsService = async (data) => {
  const news = new BreakingNewsTickerModel(data);
  return await news.save();
};

export const fetchBreakingNews = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    category,
    status,
    startDate,
    endDate,
  } = query;

  const filter = {};

  // 🔍 Search by text
  if (search) {
    filter.headline = { $regex: search, $options: "i" };
  }

  // 🎯 Filter by category
  if (category) {
    filter.category = category;
  }

  // 🎯 Filter by status
  if (status) {
    filter.status = status;
  }

  // 📆 Filter by date range
  if (endDate) {
    filter.startDateAndTime = {
      // $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [data, total] = await Promise.all([
    BreakingNewsTickerModel.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(parseInt(limit)),
    BreakingNewsTickerModel.countDocuments(filter),
  ]);

  return {
    data,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    totalItems: total,
  };
};

export const updateTickerSettingsService = async (data) => {
  const tickerSetting = await TickerSettingModel.findOneAndUpdate(
    {},
    { $set: data },
    { upsert: true, new: true }
  );

  return tickerSetting;
};
