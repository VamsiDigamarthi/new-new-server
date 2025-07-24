import BreakingNewsTickerModel from "../Modals/BreakingNewsTickerModal.js";
import { TickerSettingModel } from "../Modals/TickerSettingModal.js";

export const createBreakingNewsService = async (data) => {
  const news = new BreakingNewsTickerModel(data);
  console.log(news);
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
    currentDate, // e.g. "2025-07-24T00:54"
    startTime,
    endTime,
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

  // 📆 Date range filtering
  if (startDate && endDate) {
    filter.date = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  console.log(category, "-=-=-=-=-=cateforb");

  // ⏰ Time-based filtering using currentDate
  if (currentDate) {
    const now = new Date(currentDate); // Parse the full datetime
    const today = now.toISOString().split("T")[0]; // Extract date part: "2025-07-24"
    const currentTimeStr = now.toTimeString().slice(0, 5); // Extract time part: "00:54"

    // Match documents where:
    // - status is "Active", OR
    // - status is "Scheduled" AND today's date matches AND currentTime is between startTime and endTime
    filter.$or = [
      { status: "Active" },
      {
        status: "Scheduled",
        date: today, // This matches your DB format: "2025-07-23"
        startTime: { $lte: currentTimeStr },
        endTime: { $gte: currentTimeStr },
      },
    ];
  }

  const skip = parseInt(parseInt(page) - 1) * parseInt(limit);
  console.log(page, limit, skip, "oage and limit");

  const [data, total] = await Promise.all([
    BreakingNewsTickerModel.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(parseInt(limit)),
    BreakingNewsTickerModel.countDocuments(filter),
  ]);

  return {
    data: data,
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
