import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["mobiles", "earphones", "accessories"],
      required: true,
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
