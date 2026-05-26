import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    lastMessage: { type: String },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

chatSchema.index({ userId: 1, shopId: 1 }, { unique: true });

export default mongoose.model("Chat", chatSchema);
