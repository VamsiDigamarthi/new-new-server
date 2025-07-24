import ArticleModel from "../Modals/ArticleModel.js";
import {
  createBreakingNewsService,
  fetchBreakingNews,
  updateTickerSettingsService,
} from "../Service/BreakingNewsService.js";
import logger from "../Utils/logger.js";
import { sendResponse } from "../Utils/sendResponse.js";

export const createBreakingNewsController = async (req, res) => {
  logger.info(`BREAKING NEWS API hit `);

  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = req.file?.path;
    }

    if (!data.startTime || !data.endTime) {
      data.setActiveImmediately = true;
      data.status = "Active";
    }

    if (!data.date) {
      data.date = new Date().toISOString().split("T")[0];
    }

    console.log(req.file);

    await createBreakingNewsService(data);
    return sendResponse(res, 201, "Breaking news created successfully");
  } catch (error) {
    logger.error(`❌Article Upload Failed : ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "Failed to create breaking news", error);
  }
};

export const getBreakingNews = async (req, res) => {
  try {
    const result = await fetchBreakingNews(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const changeTickerSetting = async (req, res) => {
  try {
    // Assuming you have a service to handle the ticker settings
    const updatedSettings = await updateTickerSettingsService(req.body);
    return sendResponse(
      res,
      200,
      "Ticker settings updated successfully",
      null,
      { updatedSettings }
    );
  } catch (error) {
    logger.error(`❌Ticker Settings Update Failed : ${error}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Server error" });
  }
};

export const editBreakingNews = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await ArticleModel.findByIdAndUpdate(id, {
      $set: req.body,
    });

    if (!updated) {
      return res.status(404).send({ message: "Not Found" });
    }

    return res.status(200).send({ message: "Updated Success" });
  } catch (error) {
    logger.error(`❌Ticker Settings Update Failed : ${error}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Server error" });
  }
};
