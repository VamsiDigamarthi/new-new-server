import express from "express";
import { validate } from "../Utils/validaters.js";
import {
  breakingNewsSchema,
  tickerSettingSchema,
} from "../Validations/breakingNewsValidation.js";
import {
  changeTickerSetting,
  createBreakingNewsController,
  editBreakingNews,
  getBreakingNews,
} from "../Controller/BreakingNewsController.js";
import upload from "../Middlewares/fileUpload.js";

const router = express.Router();

router.post("/", upload.single("image"), createBreakingNewsController);
router.get("/", getBreakingNews);
router.put("/:id", editBreakingNews);

router.put(
  "/ticker-setting",
  validate(tickerSettingSchema),
  changeTickerSetting
);
export default router;
