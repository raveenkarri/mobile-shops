import Shop from '../models/Shop.js';
import Product from '../models/Product.js';

export const createShop = async (req, res) => {
  const { shopName, location, description } = req.body;
  
  const shopExists = await Shop.findOne({ shopName });
  if (shopExists) return res.status(400).json({ message: 'Shop name already taken' });
  
  const shop = await Shop.create({
    ownerId: req.user._id,
    shopName,
    location,
    description,
  });
  
  res.status(201).json(shop);
};

export const getMyShop = async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) return res.status(404).json({ message: 'No shop found' });
  res.json(shop);
};

export const updateShop = async (req, res) => {
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  
  shop.shopName = req.body.shopName || shop.shopName;
  shop.location = req.body.location || shop.location;
  shop.description = req.body.description || shop.description;
  
  const updatedShop = await shop.save();
  res.json(updatedShop);
};

export const getShops = async (req, res) => {
  const { search, location, page = 1, limit = 10 } = req.query;
  const query = {};
  
  if (search) {
    query.$or = [
      { shopName: { $regex: search, $options: 'i' } },
    ];
  }
  if (location) {
    query.location = { $regex: location, $options: 'i' };
  }
  
  const shops = await Shop.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  const total = await Shop.countDocuments(query);
  
  res.json({
    shops,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

export const getShopById = async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (!shop) return res.status(404).json({ message: 'Shop not found' });
  res.json(shop);
};