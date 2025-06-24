import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../Modals/UserModal.js";

export const checkExistingUser = async ({ email }) => {
  const existingUser = await UserModel.findOne({ email });
  return existingUser ?? null;
};

export const signupService = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ name, email, password: hashedPassword });
  await newUser.save();
};

export const updateLoginTime = async (userId, loginTime) => {
  await UserModel.findByIdAndUpdate(userId, {
    lastLoginAt: loginTime,
  });
};
