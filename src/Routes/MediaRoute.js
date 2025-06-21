import { Router } from "express";
import { addNewMedia, getGalleryData } from "../Controller/MediaController.js";
import { mediaSchema } from "../Validations/mediavalidation.js";
import { validate } from "../Utils/validaters.js";
// import { handleMulterUpload } from "../Middlewares/handleMulterUpload.js";
import upload from "../Middlewares/fileUpload.js";

const router = Router();

router.post(
  "/new-media",
  validate(mediaSchema),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "extraMedia", maxCount: 10 },
  ]),
  //   handleMulterUpload(upload.array("extraMedia", 10)),
  addNewMedia
);

router.get("/", getGalleryData);

export default router;
