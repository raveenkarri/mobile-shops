import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopName: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["mobile_store", "repair_center", "multi_brand", "accessories_specialist"],
      default: "mobile_store",
    },
    keywords: [{ type: String, trim: true, lowercase: true }],
    rating: { type: Number, min: 0, max: 5, default: 0.0 },
    popularity: { type: Number, default: 0 },
  },
  { timestamps: true },
);

shopSchema.index({ shopName: "text", location: "text", keywords: "text" });
shopSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Shop", shopSchema);
