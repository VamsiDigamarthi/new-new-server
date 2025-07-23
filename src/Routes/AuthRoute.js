import express from "express";
import {
  deletUser,
  empRegisterUser,
  forgotPassword,
  getProfile,
  getUsersController,
  loginController,
  signupController,
  updateUser,
} from "../Controller/AuthController.js";
import { validate } from "../Utils/validaters.js";
import { loginSchema, signupSchema } from "../Validations/AuthValidation.js";
import { authenticateToken } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
router.get("/users", getUsersController);
router.patch("/users/:id", updateUser);
router.post("/emp-register", empRegisterUser);
router.get("/profile", authenticateToken, getProfile);
router.patch("/forgot-password/:userId", authenticateToken, forgotPassword);
router.delete("/:id", authenticateToken, deletUser);

export default router;
