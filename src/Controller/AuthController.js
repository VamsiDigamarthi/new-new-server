import { checkExistingUser, signupService } from "../Service/AuthService.js";
import { sendResponse } from "../Utils/sendResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import logger from "../Utils/logger.js";
import UserModel from "../Modals/UserModal.js";

export const signupController = async (req, res) => {
  const { name, email } = req.body;
  logger.info(`SIGN UP hit ${name} ${email}`);
  try {
    const existingUser = await checkExistingUser({ email });
    if (existingUser) return sendResponse(res, 400, "User Already Exist");

    await signupService(req.body);
    return sendResponse(res, 200, "User Created..!");
  } catch (error) {
    logger.error(`❌User Creates Faield ${email}: ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "User Creates Faield", error);
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await checkExistingUser({ email });
    if (!existingUser) return sendResponse(res, 404, "User Not Found");

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return sendResponse(res, 400, "Incorrect Password");

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET
    );

    return sendResponse(res, 200, "", null, {
      token,
      role: existingUser?.role,
      allocatedAcces: existingUser?.categories,
    });
  } catch (error) {
    logger.error(`❌User Login Faield ${email}: ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "User Login Faield", error);
  }
};

export const getUsersController = async (req, res) => {
  const { page, limit, search, status } = req.query;
  const query = { role: "Employee" };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } },
    ];
  }

  if (status) query.status = status;
  const skip = (page - 1) * limit;

  try {
    const total = await UserModel.countDocuments(query);

    const users = await UserModel.find(query).skip(skip).limit(limit);

    return res.status(200).json({
      users,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error(`❌User Fetching Faield ${email}: ${error}`, {
      stack: error.stack,
    });
    return sendResponse(res, 500, "User Fetching Faield", error);
  }
};

export const empRegisterUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobileNumber,
      dateOfBirth,
      gender,
      region,
      categories,
    } = req.body;
    // console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user
    const user = new UserModel({
      name,
      email,
      password: hashedPassword, // 🔐 You should hash this using bcrypt in production
      mobileNumber,
      dateOfBirth,
      gender,
      region,
      categories,
      role: "Employee",
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.log("error", err);

    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getProfile = async (req, res) => {
  const { userId } = req;
  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log("error", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "User updated", data: updated });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
