import EPaperModel from "../Modals/EPaperModal.js";

export const createEPaper = async (category, editionTitle, file) => {
  const filePath = file?.path || null;

  const newEPaper = new EPaperModel({
    category,
    editionTitle,
    filePath,
  });

  return await newEPaper.save();
};

export const getAllEPapers = async ({
  page = 1,
  limit = 10,
  search = "",
  startDate,
  endDate,
  category,
  status,
}) => {
  const query = {};

  // Search by title
  if (search) {
    query.editionTitle = { $regex: search, $options: "i" }; // case-insensitive
  }

  // Date range filter
  if (startDate || endDate) {
    query.publishDate = {};
    if (startDate) query.publishDate.$gte = new Date(startDate);
    if (endDate) query.publishDate.$lte = new Date(endDate);
  }

  if (category) query.category = category;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const total = await EPaperModel.countDocuments(query);
  const epapers = await EPaperModel.find(query)
    .sort({ publishDate: -1 })
    .skip(skip)
    .limit(limit);

  return {
    epapers,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};
