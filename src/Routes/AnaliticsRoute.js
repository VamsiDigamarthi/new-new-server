import { Router } from "express";
import { getLast7DaysArticleCount } from "../Controller/AnaliticsController.js";

const router = Router();

router.get("/", getLast7DaysArticleCount);

export default router;
