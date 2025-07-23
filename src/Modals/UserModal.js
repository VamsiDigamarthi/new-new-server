import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["Admin", "Editor", "Chief Editor", "Reader", "Manager"],
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "In-Active"],
      default: "Active",
    },
    lastLogin: {
      type: String,
      default: "",
    },
    region: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: null,
    },
    categories: [{ type: String }],
    mobileNumber: { type: String, default: null },
    lastLoginAt: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
