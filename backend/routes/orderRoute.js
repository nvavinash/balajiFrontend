import express from 'express';
import { placeOrder, placeOrderRazorpay, verifyRazorpay, userOrders, allOrders, updateStatus } from '../controllers/orderController.js';
import { authUser, authAdmin } from '../middleware/auth.js';

const orderRouter = express.Router();

// User routes (require user authentication)
orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay);
orderRouter.post('/userorders', authUser, userOrders);

// Admin routes (require admin authentication)
orderRouter.post('/list', authAdmin, allOrders);
orderRouter.post('/status', authAdmin, updateStatus);

export default orderRouter;
