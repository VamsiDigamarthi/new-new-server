import express from "express";
import { handleMulterUpload } from "../Middlewares/handleMulterUpload.js";
import upload from "../Middlewares/fileUpload.js";
import {
  getWebsiteSettingsController,
  updateWebsiteSettingsController,
} from "../Controller/WebsiteSettingController.js";

const router = express.Router();

router.get("/", getWebsiteSettingsController);

router.put(
  "/",
  handleMulterUpload(
    upload.fields([
      { name: "siteLogo", maxCount: 1 },
      { name: "favIcon", maxCount: 1 },
    ])
  ),
  updateWebsiteSettingsController
);
export default router;
