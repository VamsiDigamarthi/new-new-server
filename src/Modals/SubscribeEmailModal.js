import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubscribeModal = model("subscribedemails", schema);
export default SubscribeModal;
