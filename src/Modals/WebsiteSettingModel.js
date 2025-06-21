import mongoose from "mongoose";
const { Schema } = mongoose;

const websiteSettingSchema = new Schema(
  {
    siteName: {
      type: String,
      required: true,
    },
    siteTagline: {
      type: String,
    },
    siteLogo: {
      type: String, // path or URL to logo image
    },
    favIcon: {
      type: String, // path or URL to favicon
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
    emailSettings: {
      smtpHost: { type: String, required: true },
      smtpPort: { type: Number, required: true },
      smtpUser: { type: String, required: true },
      smtpPass: { type: String, required: true },
      fromEmail: { type: String, required: true },
      senderName: { type: String, required: true },
      encryptionType: {
        type: String,
        enum: ["ssl", "tls", "none"],
        default: "tls",
      },
    },
  },
  { timestamps: true }
);

const WebsiteSettingModel = mongoose.model(
  "WebsiteSetting",
  websiteSettingSchema
);
export default WebsiteSettingModel;
