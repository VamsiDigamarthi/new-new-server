import { AdsModel } from "../Modals/AdsModal.js";

export const createAd = async (data) => {
  return await AdsModel.create(data);
};
