import express from "express";
import { validate } from "../Utils/validaters.js";
import {
  breakingNewsSchema,
  tickerSettingSchema,
} from "../Validations/breakingNewsValidation.js";
import {
  changeTickerSetting,
  createBreakingNewsController,
  getBreakingNews,
} from "../Controller/BreakingNewsController.js";

const router = express.Router();

router.post("/", validate(breakingNewsSchema), createBreakingNewsController);
router.get("/", getBreakingNews);

router.put(
  "/ticker-setting",
  validate(tickerSettingSchema),
  changeTickerSetting
);
export default router;
