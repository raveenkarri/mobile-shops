import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema(
  {
    minPurchaseAmount: { type: Number, default: 0 },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    category: {
      type: String,
      enum: ["mobiles", "earphones", "accessories", ""],
      default: "",
    },
  },
  { _id: false },
);

const bannerSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    type: {
      type: String,
      enum: ["discount", "bogo", "combo_offer"],
      default: "discount",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed", ""],
      default: "",
    },
    discountValue: { type: Number, default: 0 },
    conditions: { type: conditionSchema, default: () => ({}) },
    freeProduct: { type: String, default: "", trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    link: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

bannerSchema.index({ shopId: 1, isActive: 1, startDate: 1, endDate: 1 });

export default mongoose.model("Banner", bannerSchema);
