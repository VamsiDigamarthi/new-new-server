import { AdsModel } from "../Modals/AdsModal.js";
import { createAd } from "../Service/AdsService.js";

const adSlotDimensions = {
  "Homepage Top Banner": { width: "970px", height: "250px" },
  "Article Sidebar": { width: "300px", height: "600px" },
  Middle: { width: "728px", height: "90px" },
  "Category Footer": { width: "970px", height: "90px" },
};

export const createAdController = async (req, res) => {
  try {
    const { file } = req;
    const adData = { ...req.body };

    if (file) {
      adData.file = req.file?.path;
    }

    const selectedSlot = adData.adSlot;
    const dimensions = adSlotDimensions[selectedSlot];

    if (dimensions) {
      adData.width = dimensions.width;
      adData.height = dimensions.height;
    }

    const newAd = await createAd(adData);
    res.status(201).json(newAd);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFilteredAds = async (req, res) => {
  try {
    const {
      startDateAndTime,
      endDateAndTime,
      adSlot,
      tagetPage,
      status,
      heading,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (startDateAndTime) {
      query.startDateAndTime = { $gte: startDateAndTime };
    }

    if (endDateAndTime) {
      query.endDateAndTime = {
        ...query.endDateAndTime,
        $lte: endDateAndTime,
      };
    }

    if (adSlot) {
      query.adSlot = adSlot;
    }

    if (tagetPage) {
      query.tagetPage = tagetPage;
    }

    if (status) {
      query.status = status;
    }

    if (heading) {
      query.heading = { $regex: heading, $options: "i" };
    }

    // console.log("query", query);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await AdsModel.countDocuments(query);

    const ads = await AdsModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return res.status(200).json({
      data: ads,
      totalCount,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch ads",
      error: err.message,
    });
  }
};

export const updateAdController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If new file uploaded, update file field
    if (req.file) {
      updateData.file = req.file.path;
    }

    const updatedAd = await AdsModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({ status: true, data: updatedAd });
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ status: false, message: "Failed to update ad" });
  }
};

export const filterActiveAdsController = async (req, res) => {
  try {
    const { adSlot, tagetPage, currentDate, page = 1 } = req.query;
    // console.log(req.query, "//////////");

    if (!adSlot || !tagetPage || !currentDate) {
      return res.status(400).json({
        status: false,
        message:
          "Missing required query parameters: adSlot, tagetPage, currentDate",
      });
    }

    const baseQuery = {
      status: "Active",
      adSlot,
      startDateAndTime: { $lte: currentDate },
      endDateAndTime: { $gte: currentDate },
    };

    const skip = (Number(page) - 1) * 1; // since limit is 1 per page

    let ads = await AdsModel.find({
      ...baseQuery,
      tagetPage,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(1);

    if (!ads.length) {
      ads = await AdsModel.find({
        ...baseQuery,
        tagetPage: "All Pages",
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(1);
    }

    if (!ads.length) {
      return res.status(200).json({ message: "No Ad" });
    }

    return res.status(200).json(ads[0]);
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({
      status: false,
      message: "Failed to fetch filtered ads",
    });
  }
};
