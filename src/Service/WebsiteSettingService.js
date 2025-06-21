import WebsiteSettingModel from "../Modals/WebsiteSettingModel.js";

export const getWebsiteSettings = async () => {
  let settings = await WebsiteSettingModel.findOne();
  if (!settings) {
    settings = await WebsiteSettingModel.create({
      siteName: "Default Site",
      siteTagline: "Default Tagline",
      socialLinks: {},
      emailSettings: {
        smtpHost: "smtp.example.com",
        smtpPort: 587,
        smtpUser: "user@example.com",
        smtpPass: "dummyPassword",
        fromEmail: "noreply@example.com",
        senderName: "Default Sender",
        encryptionType: "tls",
      },
    });
  }
  return settings;
};

export const updateWebsiteSettings = async (updates, files) => {
  // console.log(updates, files);

  let settings = await WebsiteSettingModel.findOne();

  if (!settings) {
    settings = new WebsiteSettingModel();
  }

  // Handle file paths
  if (files?.siteLogo?.[0]) {
    settings.siteLogo = files.siteLogo[0].path;
  }
  if (files?.favIcon?.[0]) {
    settings.favIcon = files.favIcon[0].path;
  }

  settings.siteName = updates.siteName || settings.siteName;
  settings.siteTagline = updates.siteTagline || settings.siteTagline;

  settings.socialLinks = {
    ...settings.socialLinks,
    ...updates.socialLinks,
  };

  settings.emailSettings = {
    ...settings.emailSettings,
    ...updates.emailSettings,
  };

  return await settings.save();
};
