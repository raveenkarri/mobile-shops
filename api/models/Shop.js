import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopName: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

shopSchema.index({ shopName: "text", location: "text" });

export default mongoose.model("Shop", shopSchema);
