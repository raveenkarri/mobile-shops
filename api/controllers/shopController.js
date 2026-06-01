import Shop from "../models/Shop.js";
import { slugify } from "../utils/slugify.js";

const parseKeywords = (value = "") =>
  value
    .split(",")
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);

const generateUniqueSlug = async (baseName, existingId = null) => {
  if (!baseName || !baseName.trim()) {
    throw new Error("Invalid shop name for slug generation");
  }

  const baseSlug = slugify(baseName);
  let candidate = baseSlug;
  let iteration = 1;

  while (true) {
    const existing = await Shop.findOne({
      slug: candidate,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    }).select("_id");

    if (!existing) return candidate;

    candidate = `${baseSlug}-${iteration}`;
    iteration++;
  }
};

export const createShop = async (req, res) => {
  const {
    shopName,
    location,
    description,
    category = "mobile_store",
    keywords = "",
  } = req.body;

  if (!shopName || !location) {
    return res
      .status(400)
      .json({ message: "Shop name and location are required" });
  }

  const ownerShop = await Shop.findOne({ ownerId: req.user._id });
  if (ownerShop) {
    return res.status(400).json({ message: "Owner already has a shop" });
  }

  const slug = await generateUniqueSlug(shopName);

  const shop = await Shop.create({
    ownerId: req.user._id,
    shopName,
    slug,
    location,
    description,
    category,
    keywords: parseKeywords(keywords),
  });

  return res.status(201).json(shop);
};

export const getMyShop = async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) return res.status(404).json({ message: "No shop found" });
  return res.json(shop);
};

export const updateShop = async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) return res.status(404).json({ message: "Shop not found" });

  const oldName = shop.shopName;
  const nextName = req.body.shopName?.trim() || oldName;

  if (!nextName) {
    return res.status(400).json({ message: "Shop name cannot be empty" });
  }

  // Update fields
  shop.shopName = nextName;
  shop.location = req.body.location || shop.location;
  shop.description = req.body.description ?? shop.description;
  shop.category = req.body.category || shop.category;

  if (req.body.keywords !== undefined) {
    shop.keywords = parseKeywords(req.body.keywords);
  }

  // ✅ regenerate slug ONLY if name changed
  if (nextName !== oldName) {
    shop.slug = await generateUniqueSlug(nextName, shop._id);
  }

  const updatedShop = await shop.save();
  return res.json(updatedShop);
};

export const getShops = async (req, res) => {
  const {
    search = "",
    location = "",
    category = "",
    sortBy = "latest",
    page = 1,
    limit = 10,
  } = req.query;
  const parsedPage = Number(page) || 1;
  const parsedLimit = Number(limit) || 10;
  const query = {};

  if (search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    query.$or = [
      { shopName: searchRegex },
      { location: searchRegex },
      { keywords: searchRegex },
      { description: searchRegex },
    ];
  }

  if (location.trim()) {
    query.location = { $regex: location.trim(), $options: "i" };
  }

  if (category.trim()) {
    query.category = category.trim();
  }

  const sortMap = {
    latest: { createdAt: -1 },
    popularity: { popularity: -1, createdAt: -1 },
    rating: { rating: -1, createdAt: -1 },
    name: { shopName: 1 },
  };

  const shops = await Shop.find(query)
    .limit(parsedLimit)
    .skip((parsedPage - 1) * parsedLimit)
    .sort(sortMap[sortBy] || sortMap.latest);

  const total = await Shop.countDocuments(query);

  return res.json({
    shops,
    totalPages: Math.ceil(total / parsedLimit),
    currentPage: parsedPage,
  });
};

export const getShopById = async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  return res.json(shop);
};

export const getShopBySlug = async (req, res) => {
  const shop = await Shop.findOne({ slug: req.params.slug });
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  return res.json(shop);
};
