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
    currentDate,
  } = query;

  const filter = {};

  console.log(currentDate, "--------================0-------------");

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
  filter.startDateAndTime = {
    $lte: currentDate,
  };
  filter.endDateAndTime = {
    $gte: currentDate,
  };

  console.log(new Date(currentDate), currentDate, "--------------");

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [data, total, tickerSetting] = await Promise.all([
    BreakingNewsTickerModel.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(parseInt(limit)),
    BreakingNewsTickerModel.countDocuments(filter),
    TickerSettingModel.findOne({}),
  ]);

  // console.log(data);

  return {
    data: data,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    totalItems: total,
    tickerSetting: tickerSetting,
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
