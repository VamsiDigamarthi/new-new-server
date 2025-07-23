import express from "express";
import { validate } from "../Utils/validaters.js";
import { articleSchema } from "../Validations/articleValidation.js";
import {
  createArticleController,
  deletArticle,
  getArticlesController,
  getArticlesControllerToNewsWeb,
  getArticlesSubTypeController,
  getFutureArticles,
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
router.delete("/:id", deletArticle);
router.get("/future-articles", getFutureArticles);

export default router;
