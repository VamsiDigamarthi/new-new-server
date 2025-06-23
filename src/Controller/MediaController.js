import mongoose from "mongoose";
import ArticleModel from "../Modals/ArticleModel.js";
import logger from "../Utils/logger.js";
import { sendResponse } from "../Utils/sendResponse.js";

export const addNewMedia = async (req, res) => {
  try {
    logger.info(`Add New Media API hit`);
    const thumbnailImage = req.files?.image[0]?.path;
    const extraFiles = req.files?.extraMedia?.map((e) => e.path) || [];
    console.log(thumbnailImage, extraFiles);

    const newMedia = await ArticleModel.create({
      ...req.body,
      author: new mongoose.Types.ObjectId(),
      newsType: req.body.mediaType,
      image: thumbnailImage,
      extraMedia: extraFiles.map((e) => ({ url: e })),
    });

    // console.log(newMedia);

    return res.status(200).send(newMedia);
  } catch (error) {
    logger.error(`❌Article Upload Failed : ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "Article Upload Failed", error);
  }
};

export const getGalleryData = async (req, res) => {
  try {
    const query = {};
    const { newsType, pageSize, pageNumber } = req.query;

    // newsType = imagegallery or videogallery

    if (newsType) query.newsType = newsType;
    let GalleryData = ArticleModel.find(query).sort({ createdAt: -1 });

    if (pageNumber && pageSize) {
      const limit = parseInt(pageSize);
      const skip = (parseInt(pageNumber) - 1) * limit;

      GalleryData = GalleryData.skip(skip).limit(limit);
    }

    const data = await GalleryData;

    // console.log(data);

    return res.status(200).json(data);
  } catch (error) {
    logger.error(`❌Get Gallery Data Failed : ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "Get Gallery Data Failed", error);
  }
};
