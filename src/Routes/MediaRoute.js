import { Router } from "express";
import {
  addNewMedia,
  getGalleryData,
  // getGalleryPageData,
} from "../Controller/MediaController.js";
import { mediaSchema } from "../Validations/mediavalidation.js";
import { validate } from "../Utils/validaters.js";
// import { handleMulterUpload } from "../Middlewares/handleMulterUpload.js";
import upload from "../Middlewares/fileUpload.js";

const router = Router();

router.post(
  "/new-media",
  // validate(mediaSchema),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "extraMedia", maxCount: 10 },
  ]),
  addNewMedia
);

router.get("/", getGalleryData);

// router.get("/gallery/:type", getGalleryPageData);

export default router;
