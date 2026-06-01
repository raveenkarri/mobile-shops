import express from "express";
import {
  createBanner,
  deleteBanner,
  getBannersByShopId,
  getMyBanners,
  updateBanner,
} from "../controllers/bannerController.js";
import { ownerOnly, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/global", getBannersByShopId);
router.get("/shop/:shopId", getBannersByShopId);
router.get("/my", protect, ownerOnly, getMyBanners);
router.get("/:shopId", getBannersByShopId);
router.post("/", protect, ownerOnly, upload.single("image"), createBanner);
router.put("/:id", protect, ownerOnly, upload.single("image"), updateBanner);
router.delete("/:id", protect, ownerOnly, deleteBanner);

export default router;
