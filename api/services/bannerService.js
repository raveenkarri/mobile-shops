import Banner from "../models/Banner.js";
import Shop from "../models/Shop.js";

const isDateActive = (banner, now = new Date()) => {
  const start = new Date(banner.startDate);
  const end = new Date(banner.endDate);
  return banner.isActive && start <= now && end >= now;
};

export const findOwnerShop = async (ownerId) => {
  return Shop.findOne({ ownerId });
};

const assertOwnerAccessToShop = (ownerShop, targetShopId) => {
  if (!ownerShop || ownerShop._id.toString() !== targetShopId.toString()) {
    const err = new Error("You can only manage banners for your own shop");
    err.status = 403;
    throw err;
  }
};

export const createBannerForOwner = async ({ ownerId, payload, imagePath }) => {
  const ownerShop = await findOwnerShop(ownerId);
  if (!ownerShop) {
    const err = new Error("Create your shop before adding banners");
    err.status = 400;
    throw err;
  }

  const assignedShopId = payload.shopId || ownerShop._id;
  assertOwnerAccessToShop(ownerShop, assignedShopId);

  return Banner.create({
    shopId: assignedShopId,
    image: imagePath,
    title: payload.title,
    description: payload.description || "",
    type: payload.type,
    discountType: payload.discountType || "",
    discountValue: Number(payload.discountValue || 0),
    conditions: payload.conditions || {},
    freeProduct: payload.freeProduct || "",
    startDate: payload.startDate,
    endDate: payload.endDate,
    link: payload.link || "",
    isActive: payload.isActive ?? true,
  });
};

export const getGlobalBanners = async () => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 }).limit(24);
  return banners.filter((banner) => isDateActive(banner));
};

export const getShopBanners = async (shopId) => {
  const banners = await Banner.find({ shopId, isActive: true }).sort({ createdAt: -1 });
  return banners.filter((banner) => isDateActive(banner));
};

export const getOwnerBanners = async (ownerId) => {
  const ownerShop = await findOwnerShop(ownerId);
  if (!ownerShop) return [];
  return Banner.find({ shopId: ownerShop._id }).sort({ createdAt: -1 });
};

export const updateBannerForOwner = async ({ ownerId, bannerId, payload, imagePath }) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    const err = new Error("Banner not found");
    err.status = 404;
    throw err;
  }

  const ownerShop = await findOwnerShop(ownerId);
  assertOwnerAccessToShop(ownerShop, banner.shopId);

  if (payload.title !== undefined) banner.title = payload.title;
  if (payload.description !== undefined) banner.description = payload.description;
  if (payload.type !== undefined) banner.type = payload.type;
  if (payload.discountType !== undefined) banner.discountType = payload.discountType;
  if (payload.discountValue !== undefined) banner.discountValue = Number(payload.discountValue || 0);
  if (payload.conditions !== undefined) banner.conditions = payload.conditions;
  if (payload.freeProduct !== undefined) banner.freeProduct = payload.freeProduct;
  if (payload.startDate !== undefined) banner.startDate = payload.startDate;
  if (payload.endDate !== undefined) banner.endDate = payload.endDate;
  if (payload.link !== undefined) banner.link = payload.link;
  if (payload.isActive !== undefined) banner.isActive = payload.isActive;
  if (imagePath) banner.image = imagePath;

  return banner.save();
};

export const deleteBannerForOwner = async ({ ownerId, bannerId }) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    const err = new Error("Banner not found");
    err.status = 404;
    throw err;
  }

  const ownerShop = await findOwnerShop(ownerId);
  assertOwnerAccessToShop(ownerShop, banner.shopId);

  await banner.deleteOne();
};
