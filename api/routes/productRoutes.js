import express from 'express';
import { addProduct, getShopProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, ownerOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/shop/:shopId', getShopProducts);
router.post('/', protect, ownerOnly, upload.array('images', 5), addProduct);
router.put('/:id', protect, ownerOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, ownerOnly, deleteProduct);

export default router;