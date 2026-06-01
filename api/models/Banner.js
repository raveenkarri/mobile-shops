import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      default: null,
    },
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    link: { type: String, default: "", trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

bannerSchema.index({ shopId: 1, isActive: 1, createdAt: -1 });

export default mongoose.model("Banner", bannerSchema);
