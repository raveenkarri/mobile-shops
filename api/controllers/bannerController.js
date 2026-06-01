import {
  createBannerForOwner,
  deleteBannerForOwner,
  getGlobalBanners,
  getOwnerBanners,
  getShopBanners,
  updateBannerForOwner,
} from "../services/bannerService.js";
import {
  createBannerSchema,
  updateBannerSchema,
} from "../validators/bannerValidation.js";

const sendError = (res, error, fallbackStatus = 500) => {
  const statusCode = error.status || fallbackStatus;
  return res.status(statusCode).json({ message: error.message || "Server error" });
};

export const createBanner = async (req, res) => {
  const { error } = createBannerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (!req.file?.path) {
    return res.status(400).json({ message: "Banner image is required" });
  }

  try {
    const banner = await createBannerForOwner({
      ownerId: req.user._id,
      payload: req.body,
      imagePath: req.file.path,
    });
    return res.status(201).json(banner);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getBannersByShopId = async (req, res) => {
  try {
    const banners =
      req.params.shopId === "global"
        ? await getGlobalBanners()
        : await getShopBanners(req.params.shopId);
    return res.json(banners);
  } catch (err) {
    return sendError(res, err);
  }
};

export const getMyBanners = async (req, res) => {
  try {
    const banners = await getOwnerBanners(req.user._id);
    return res.json(banners);
  } catch (err) {
    return sendError(res, err);
  }
};

export const updateBanner = async (req, res) => {
  const hasBodyFields = Object.keys(req.body || {}).length > 0;
  const { error } = updateBannerSchema.validate(req.body);
  if (error && !req.file?.path) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (!hasBodyFields && !req.file?.path) {
    return res.status(400).json({ message: "At least one field or image is required to update banner" });
  }

  try {
    const banner = await updateBannerForOwner({
      ownerId: req.user._id,
      bannerId: req.params.id,
      payload: req.body,
      imagePath: req.file?.path,
    });
    return res.json(banner);
  } catch (err) {
    return sendError(res, err);
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await deleteBannerForOwner({
      ownerId: req.user._id,
      bannerId: req.params.id,
    });
    return res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    return sendError(res, err);
  }
};
