import {
  getWebsiteSettings,
  updateWebsiteSettings,
} from "../Service/WebsiteSettingService.js";

export const getWebsiteSettingsController = async (req, res) => {
  try {
    const data = await getWebsiteSettings();
    res.status(200).json({ message: "Fetched successfully", data });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch settings", error: err.message });
  }
};

export const updateWebsiteSettingsController = async (req, res) => {
  try {
    const files = req.files;
    const updates = req.body;

    // console.log(req.body);
    // console.log(req.files);

    const result = await updateWebsiteSettings(updates, files);

    // console.log(result);

    res.status(200).json({ message: "Updated successfully", data: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update settings", error: err.message });
  }
};
