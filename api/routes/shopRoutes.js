import express from 'express';
import { createShop, getMyShop, updateShop, getShops, getShopById, getShopBySlug } from '../controllers/shopController.js';
import { protect, ownerOnly } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getShops)
  .post(protect, ownerOnly, createShop);

router.get('/my-shop', protect, ownerOnly, getMyShop);
router.put('/my-shop', protect, ownerOnly, updateShop);
router.get('/slug/:slug', getShopBySlug);
router.get('/:id', getShopById);

export default router;
