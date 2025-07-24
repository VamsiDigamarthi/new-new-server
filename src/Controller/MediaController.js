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

    const data = req.body;

    console.log(data, "from ew");

    if (!data.startTime || !data.endTime) {
      data.status = "Active";
    }

    if (!data.date) {
      data.date = new Date().toISOString().split("T")[0];
    }

    const newMedia = await ArticleModel.create({
      ...req.body,
      ...data,
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
    const { newsType, pageSize, pageNumber, category } = req.query;

    if (newsType) query.newsType = newsType;

    console.log(newsType, "-----------TYOE");

    console.log(category, "-----------TYOE");

    if (category && category !== "null" && category !== "") {
      query.category = category;
    }

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

export const getBothImageAndVideo = async (req, res) => {
  try {
    const query = {};
    const { pageSize, pageNumber, category } = req.query;

    console.log(category, "-----------CATEGORY");

    if (category && category !== "null" && category !== "") {
      query.category = category;
    }

    query.newsType = {
      $in: ["imagegallery", "videogallery"],
    };

    // Convert to integers with defaults
    const limit = pageSize ? parseInt(pageSize) : 10;
    const page = pageNumber ? parseInt(pageNumber) : 1;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalDocuments = await ArticleModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    // Get paginated data
    const GalleryData = await ArticleModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Prepare pagination info
    const paginationInfo = {
      data: GalleryData,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalDocuments: totalDocuments,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      },
    };

    return res.status(200).json(paginationInfo);
  } catch (error) {
    logger.error(`❌Get Gallery Data Failed : ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "Get Gallery Data Failed", error);
  }
};

// export const getGalleryPageData = async (req, res) => {
//   try {
//     const { type } = req.params;

//     if (!type) {
//       return res.status(400).send("Please specify type");
//     }

//     const galleryData = await ArticleModel.find({
//       newsType: type,
//     }).sort({ createdAt: -1 });

//     if (!galleryData) {
//       return res.status(404).send("No Data found");
//     }
//     return res.status(200).send(galleryData);
//   } catch (error) {
//     logger.error(`❌Get Gallery Page Data Failed : ${error}`, {
//       stack: error.stack,
//     });
//     return sendResponse(res, 500, "Get Gallery Data Failed", error);
//   }
// };
