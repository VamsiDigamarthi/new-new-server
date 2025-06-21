import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import mongoose from "mongoose";
import logger from "./Utils/logger.js";
import errorHandler from "./Middlewares/errorHandler.js";

import AuthRoute from "./Routes/AuthRoute.js";
import ArticleRoute from "./Routes/ArticleRoute.js";
import BreakingNewsRoute from "./Routes/BreakingNewsRoutes.js";
import EPaper from "./Routes/EPaperRoute.js";
import WebsiteSetting from "./Routes/websiteSettingRoutes.js";
import MediaRoute from "./Routes/MediaRoute.js";

const app = express();
const PORT = process.env.PORT || 9999;

// app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static("uploads")
);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

function startHTTPServer() {
  app.listen(PORT, () => {
    logger.info(`New Site Service is running on port ${PORT}`);
  });
}
app.use("/auth", AuthRoute);
app.use("/article", ArticleRoute);
app.use("/breaking-new", BreakingNewsRoute);
app.use("/e-paper", EPaper);
app.use("/web-settings", WebsiteSetting);
app.use("/media", MediaRoute);

startHTTPServer();
// logger.warn(`⚠️ Order ${orderId} already accepted or cancelled`);
