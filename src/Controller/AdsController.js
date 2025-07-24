import { AdsModel } from "../Modals/AdsModal.js";
import { createAd } from "../Service/AdsService.js";

const adSlotDimensions = {
  "Top Banner": { width: "970px", height: "250px" },
  "Article Sidebar": { width: "300px", height: "600px" },
  Middle: { width: "728px", height: "90px" },
  Footer: { width: "970px", height: "90px" },
};

export const createAdController = async (req, res) => {
  try {
    console.log("req.body", req.body);

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

    console.log(req.query, "---");
    const baseQuery = {};

    if (startDateAndTime) {
      baseQuery.startDateAndTime = { $gte: startDateAndTime };
    }

    if (endDateAndTime) {
      baseQuery.endDateAndTime = {
        ...baseQuery.endDateAndTime,
        $lte: endDateAndTime,
      };
    }

    if (adSlot) {
      baseQuery.adSlot = adSlot;
    }

    if (tagetPage) {
      baseQuery.tagetPage = tagetPage;
    }

    if (heading) {
      baseQuery.heading = { $regex: heading, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🔹 Include `status` only for paginated data
    const paginatedQuery = { ...baseQuery };
    // if (status) {
    //   paginatedQuery.status = status;
    // }

    const [ads, totalCount, activeCount, inActiveCount, scheduledCount] =
      await Promise.all([
        AdsModel.find(paginatedQuery)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),

        AdsModel.countDocuments(paginatedQuery),

        AdsModel.countDocuments({ ...baseQuery, status: "Active" }),
        AdsModel.countDocuments({ ...baseQuery, status: "In-Active" }),
        AdsModel.countDocuments({ ...baseQuery, status: "Scheduled" }),
      ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return res.status(200).json({
      data: ads,
      currentPage: parseInt(page),
      totalPages,
      statusCounts: {
        active: activeCount,
        inActive: inActiveCount,
        scheduled: scheduledCount,
        totalCount,
      },
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

export const updateAdsBySlot = async (req, res) => {
  try {
    const { adSlot, width, height, status, dimenstionActive } = req.body;

    if (!adSlot) {
      return res.status(400).json({ message: "adSlot is required" });
    }

    const updateData = {};
    if (width) updateData.width = width;
    if (height) updateData.height = height;
    if (status) updateData.status = status;
    if (dimenstionActive !== undefined)
      updateData.dimenstionActive = dimenstionActive;

    const result = await AdsModel.updateMany({ adSlot }, { $set: updateData });

    res.status(200).json({
      message: "Ads updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAdSlotConfigs = async (req, res) => {
  try {
    const configs = await AdsModel.aggregate([
      {
        $group: {
          _id: "$adSlot",
          width: { $first: "$width" },
          height: { $first: "$height" },
          dimenstionActive: { $first: "$dimenstionActive" },
        },
      },
    ]);

    const desiredOrder = [
      "Homepage Top Banner",
      "Article Sidebar",
      "Middle",
      "Category Footer",
    ];

    const sortedConfigs = desiredOrder
      .map((slot) => configs.find((c) => c._id === slot))
      .filter(Boolean); // remove undefined if any slot is missing

    res.status(200).json(sortedConfigs);
  } catch (error) {
    console.error("Error fetching ad slot configs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
