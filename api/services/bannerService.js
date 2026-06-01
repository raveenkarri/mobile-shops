import Banner from "../models/Banner.js";
import Shop from "../models/Shop.js";

export const findOwnerShop = async (ownerId) => {
  return Shop.findOne({ ownerId });
};

export const createBannerForOwner = async ({ ownerId, payload, imagePath }) => {
  const ownerShop = await findOwnerShop(ownerId);
  if (!ownerShop) {
    throw new Error("Create your shop before adding banners");
  }

  const assignedShopId =
    payload.shopId && payload.shopId !== "global" ? payload.shopId : ownerShop._id;

  if (assignedShopId.toString() !== ownerShop._id.toString()) {
    const err = new Error("You can only create banners for your own shop");
    err.status = 403;
    throw err;
  }

  return Banner.create({
    shopId: assignedShopId,
    image: imagePath,
    title: payload.title,
    link: payload.link || "",
    isActive: payload.isActive ?? true,
  });
};

export const getGlobalBanners = async () => {
  return Banner.find({ isActive: true }).sort({ createdAt: -1 }).limit(12);
};

export const getShopBanners = async (shopId) => {
  return Banner.find({ shopId, isActive: true }).sort({ createdAt: -1 });
};

export const updateBannerForOwner = async ({ ownerId, bannerId, payload, imagePath }) => {
  const banner = await Banner.findById(bannerId);
  if (!banner) {
    const err = new Error("Banner not found");
    err.status = 404;
    throw err;
  }

  const ownerShop = await findOwnerShop(ownerId);
  if (!ownerShop || banner.shopId?.toString() !== ownerShop._id.toString()) {
    const err = new Error("Not authorized to update this banner");
    err.status = 403;
    throw err;
  }

  if (payload.title !== undefined) banner.title = payload.title;
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
  if (!ownerShop || banner.shopId?.toString() !== ownerShop._id.toString()) {
    const err = new Error("Not authorized to delete this banner");
    err.status = 403;
    throw err;
  }

  await banner.deleteOne();
};

export const getOwnerBanners = async (ownerId) => {
  const ownerShop = await findOwnerShop(ownerId);
  if (!ownerShop) return [];
  return Banner.find({ shopId: ownerShop._id }).sort({ createdAt: -1 });
};
