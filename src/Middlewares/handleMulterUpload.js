import multer from "multer";
import logger from "../Utils/logger.js";

export const handleMulterUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      logger.error(`❌ Multer error while uploading:`, err);
      return res.status(400).json({
        message: "Multer error while uploading",
        error: err.message,
        stack: err.stack,
      });
    } else if (err) {
      logger.error(`❌ Unknown error occured while uploading:`, err);
      return res.status(500).json({
        message: "Unknown error occured while uploading",
        error: err.message,
        stack: err.stack,
      });
    }
    next();
  });
};
