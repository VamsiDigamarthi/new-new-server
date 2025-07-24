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

    console.log(newsType, "-----------TYPE");
    console.log(category, "-----------CATEGORY");

    if (category && category !== "null" && category !== "") {
      query.category = category;
    }

    // Add date and time filtering logic
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5); // HH:MM format

    // Add complex query for date/time filtering
    query.$or = [
      // For active articles published today
      {
        status: "Active",
        publishedDate: today,
      },
      // For scheduled articles with date and time checks
      {
        status: "Scheduled",
        date: today,
        startTime: { $lte: currentTime },
        endTime: { $gte: currentTime },
      },
    ];

    let GalleryQuery = ArticleModel.find(query).sort({ createdAt: -1 });

    if (pageNumber && pageSize) {
      const limit = parseInt(pageSize);
      const skip = (parseInt(pageNumber) - 1) * limit;
      GalleryQuery = GalleryQuery.skip(skip).limit(limit);
    }

    const data = await GalleryQuery;

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

export const editMedia = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Edit Media API hit for ID: ${id}`);

    const thumbnailImage = req.files?.image?.[0]?.path;
    const extraFiles = req.files?.extraMedia?.map((e) => e.path) || [];

    const data = { ...req.body };

    console.log(req.body, req.files);

    // Set default status if startTime or endTime is missing
    if (!data.startTime || !data.endTime) {
      data.status = "Active";
    }

    // Set default date if not provided
    if (!data.date) {
      data.date = new Date().toISOString().split("T")[0];
    }

    // Assign image if uploaded
    if (thumbnailImage) {
      data.image = thumbnailImage;
    }

    // Map extra media files to objects with url
    if (extraFiles.length > 0) {
      data.extraMedia = extraFiles.map((url) => ({ url }));
    }

    // Ensure author is a valid ObjectId if provided
    if (data.author) {
      data.author = new mongoose.Types.ObjectId(data.author);
    }

    // Set newsType from mediaType if present
    if (data.mediaType) {
      data.newsType = data.mediaType;
    }

    // Update the article
    const updatedMedia = await ArticleModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedMedia) {
      return sendResponse(res, 404, "Media not found");
    }

    return sendResponse(res, 200, "Media updated successfully", updatedMedia);
  } catch (error) {
    logger.error(`❌ Edit Media Failed : ${error.message}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "Edit Media Failed", error.message);
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await ArticleModel.findByIdAndDelete(id);

    if (!media) {
      return res.status(404).send({ message: "Not found" });
    }

    return res.status(200).send({ message: "Deleted" });
  } catch (error) {
    logger.error(`❌ Dekete Media Failed : ${error.message}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "Edit Media Failed", error.message);
  }
};
