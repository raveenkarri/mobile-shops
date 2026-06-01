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

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return undefined;
};

const parsePayload = (rawBody = {}) => {
  const parsed = { ...rawBody };
  if (rawBody.conditions && typeof rawBody.conditions === "string") {
    try {
      parsed.conditions = JSON.parse(rawBody.conditions);
    } catch {
      parsed.conditions = {};
    }
  }
  if (rawBody.discountValue !== undefined) {
    parsed.discountValue = Number(rawBody.discountValue);
  }
  if (rawBody.isActive !== undefined) {
    parsed.isActive = parseBoolean(rawBody.isActive);
  }
  if (rawBody.startDate) parsed.startDate = new Date(rawBody.startDate);
  if (rawBody.endDate) parsed.endDate = new Date(rawBody.endDate);
  return parsed;
};

export const createBanner = async (req, res) => {
  const payload = parsePayload(req.body);
  const { error } = createBannerSchema.validate(payload);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (new Date(payload.startDate) > new Date(payload.endDate)) {
    return res.status(400).json({ message: "startDate must be earlier than endDate" });
  }

  if (!req.file?.path) {
    return res.status(400).json({ message: "Banner image is required" });
  }

  try {
    const banner = await createBannerForOwner({
      ownerId: req.user._id,
      payload,
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
  const payload = parsePayload(req.body);
  const hasBodyFields = Object.keys(payload || {}).length > 0;
  const { error } = updateBannerSchema.validate(payload);
  if (error && !req.file?.path) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (!hasBodyFields && !req.file?.path) {
    return res.status(400).json({ message: "At least one field or image is required to update banner" });
  }
  if (payload.startDate && payload.endDate && new Date(payload.startDate) > new Date(payload.endDate)) {
    return res.status(400).json({ message: "startDate must be earlier than endDate" });
  }

  try {
    const banner = await updateBannerForOwner({
      ownerId: req.user._id,
      bannerId: req.params.id,
      payload,
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
