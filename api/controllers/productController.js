import Product from '../models/Product.js';
import Shop from '../models/Shop.js';

export const addProduct = async (req, res) => {
  const { name, category, price, stock } = req.body;
  const shop = await Shop.findOne({ ownerId: req.user._id });
  
  if (!shop) return res.status(404).json({ message: 'No shop found' });
  
  const images = req.files ? req.files.map(file => file.path) : [];
  
  const product = await Product.create({
    shopId: shop._id,
    name,
    category,
    price,
    stock,
    images,
  });
  
  res.status(201).json(product);
};

export const getShopProducts = async (req, res) => {
  const { shopId } = req.params;
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  
  const products = await Product.find({ shopId })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Product.countDocuments({ shopId });
  
  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

export const getMyProducts = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const shop = await Shop.findOne({ ownerId: req.user._id });

  if (!shop) {
    return res.status(404).json({ message: 'No shop found for this owner' });
  }

  const products = await Product.find({ shopId: shop._id })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments({ shopId: shop._id });

  return res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (product.shopId.toString() !== shop._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  product.name = req.body.name || product.name;
  product.category = req.body.category || product.category;
  product.price = req.body.price || product.price;
  product.stock = req.body.stock || product.stock;
  if (req.files && req.files.length) {
    product.images = req.files.map(file => file.path);
  }
  
  const updated = await product.save();
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  const shop = await Shop.findOne({ ownerId: req.user._id });
  if (product.shopId.toString() !== shop._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  await product.deleteOne();
  res.json({ message: 'Product removed' });
};
