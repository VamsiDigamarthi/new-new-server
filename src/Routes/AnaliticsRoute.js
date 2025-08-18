import { Router } from "express";
import {
  getAllsubs,
  getLast7DaysArticleCount,
  subScribeToemail,
} from "../Controller/AnaliticsController.js";

const router = Router();

router.get("/", getLast7DaysArticleCount);

router.post("/subscribe", subScribeToemail);
router.get("/subscribe", getAllsubs);

export default router;
