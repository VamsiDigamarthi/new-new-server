import { createEPaper, getAllEPapers } from "../Service/EPaperService.js";

export const createEPaperController = async (req, res) => {
  try {
    const { editionTitle, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const paper = await createEPaper(category, editionTitle, req.file);
    res
      .status(201)
      .json({ message: "EPaper created successfully", data: paper });
  } catch (err) {
    console.error("Create ePaper Error:", err);
    res
      .status(500)
      .json({ message: "Failed to create ePaper", error: err.message });
  }
};

export const getAllEPapersController = async (req, res) => {
  try {
    const { page, limit, search, startDate, endDate, category, status } =
      req.query;

    const result = await getAllEPapers({
      page,
      limit,
      search,
      startDate,
      endDate,
      category,
      status,
    });

    res.status(200).json({
      message: "EPapers fetched successfully",
      ...result,
    });
  } catch (err) {
    console.error("Fetch EPapers Error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch ePapers", error: err.message });
  }
};

// export const createEPaperController = async (req, res) => {
//   try {
//     const { editionTitle, noOfPages } = req.body;
//     if (!req.files || req.files.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one image is required" });
//     }

//     const paper = await createEPaper(editionTitle, noOfPages, req.files);
//     res
//       .status(201)
//       .json({ message: "EPaper created successfully", data: paper });
//   } catch (err) {
//     console.error("Create ePaper Error:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to create ePaper", error: err.message });
//   }
// };
