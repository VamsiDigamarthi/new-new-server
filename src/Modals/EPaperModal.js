import mongoose from "mongoose";
const { Schema } = mongoose;

const ePaperSchema = new Schema({
  category: {
    type: String,
    enum: ["Telangana", "Andhra Pradesh"],
    default: "Telangana",
    required: true,
  },
  state: { type: String, required: true },
  editionTitle: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },

  filePath: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Scheduled"],
    default: "Scheduled",
  },
});

const EPaperModel = mongoose.model("EPaper", ePaperSchema);
export default EPaperModel;
