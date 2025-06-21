import express from "express";
import { validate } from "../Utils/validaters.js";
import { articleSchema } from "../Validations/articleValidation.js";
import {
  createArticleController,
  getArticlesController,
  getArticlesControllerToNewsWeb,
  getArticlesSubTypeController,
  getSingleArticlesController,
  getTopNewsByCategory,
} from "../Controller/ArticleController.js";
import { handleMulterUpload } from "../Middlewares/handleMulterUpload.js";
import upload from "../Middlewares/fileUpload.js";

const router = express.Router();
router.post(
  "/",
  validate(articleSchema),
  handleMulterUpload(upload.single("image")),
  createArticleController
);

router.get("/", getArticlesController);
router.get("/:page/:id", getSingleArticlesController);

router.get("/new-web", getArticlesControllerToNewsWeb);
router.get("/sub-type", getArticlesSubTypeController);
router.get("/all-type", getTopNewsByCategory);

export default router;
