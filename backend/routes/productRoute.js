import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct, updateProduct } from '../controllers/productController.js';
import { authAdmin } from '../middleware/auth.js';

const productRouter = express.Router();

// Admin routes for product management
productRouter.post('/add', authAdmin, addProduct);
productRouter.post('/remove', authAdmin, removeProduct);
productRouter.post('/single', authAdmin, singleProduct);
productRouter.post('/update', authAdmin, updateProduct);
productRouter.get('/list', listProducts); // List products is public for frontend use

export default productRouter;
