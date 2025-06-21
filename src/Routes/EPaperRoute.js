import express from "express";
import { handleMulterUpload } from "../Middlewares/handleMulterUpload.js";
import upload from "../Middlewares/fileUpload.js";
import {
  createEPaperController,
  getAllEPapersController,
} from "../Controller/EPaperController.js";

const router = express.Router();

router.post(
  "/",
  handleMulterUpload(upload.single("file")),
  createEPaperController
);
router.get("/", getAllEPapersController);
export default router;
