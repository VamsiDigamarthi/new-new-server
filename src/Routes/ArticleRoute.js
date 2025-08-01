import express from "express";
import { validate } from "../Utils/validaters.js";
import { articleSchema } from "../Validations/articleValidation.js";
import {
  approvedArt,
  createArticleController,
  deletArticle,
  getArticlesController,
  getArticlesControllerToNewsWeb,
  getArticlesSubTypeController,
  getFutureArticles,
  getSingleArticlesController,
  getTopNewsByCategory,
  incrementViewCount,
  updateArticle,
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
router.patch(
  "/update-article/:id",
  handleMulterUpload(upload.single("image")),
  updateArticle
);
router.get("/future-articles", getFutureArticles);

router.patch("/views/:id", incrementViewCount);
router.patch("/approved/:id", approvedArt);

export default router;
