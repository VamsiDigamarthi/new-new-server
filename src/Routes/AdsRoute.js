import express from "express";
import { handleMulterUpload } from "../Middlewares/handleMulterUpload.js";
import upload from "../Middlewares/fileUpload.js";
import {
  createAdController,
  filterActiveAdsController,
  getFilteredAds,
  updateAdController,
} from "../Controller/AdsController.js";

const router = express.Router();
router.post("/", handleMulterUpload(upload.single("file")), createAdController);
router.get("/", getFilteredAds);
router.put(
  "/:id",
  handleMulterUpload(upload.single("file")),
  updateAdController
);

router.get("/filter", filterActiveAdsController);

export default router;
