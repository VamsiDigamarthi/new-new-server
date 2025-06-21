import express from "express";
import {
  empRegisterUser,
  getUsersController,
  loginController,
  signupController,
} from "../Controller/AuthController.js";
import { validate } from "../Utils/validaters.js";
import { loginSchema, signupSchema } from "../Validations/AuthValidation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
router.get("/users", getUsersController);
router.post("/emp-register", empRegisterUser);

export default router;
