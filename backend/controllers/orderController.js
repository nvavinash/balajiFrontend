import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper function to generate order ID
const generatePurchaseId = () => {
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${ymd}-${random}`;
}

// Place order using COD (Cash on Delivery) method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Validate required fields
        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Cart is empty" });
        }

        if (!address) {
            return res.json({ success: false, message: "Delivery address is required" });
        }


        // Create order data
        const orderData = {
            purchaseId: generatePurchaseId(),
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }


        // Save order to database
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear user's cart data after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Place order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            purchaseId: generatePurchaseId(),
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Fetch order by razorpay_order_id to find the receipt (our DB order ID)
            // But wait, we don't store razorpay_order_id in our DB yet.
            // The frontend should ideally send back the receipt or we can fetch from razorpay.
            // To be robust, let's fetch from razorpay to ensure validity and get receipt.

            // Wait, fetching from RZPAY is an extra network call. 
            // The signature verification already proves authenticity.
            // But to get the correct orderModel ID (which is in receipt), we might need it.
            // UNLESS the frontend sends it back. Usually frontend sends whatever RZPAY returns.
            // RZPAY frontend callback contains order_id.

            // Let's rely on fetching details from RZPAY using order_id to get receipt, 
            // OR find the order in our DB where date is close? No.
            // Store razorpay_order_id in DB? We didn't add that field to schema.
            // receipt in RZPAY order is equal to newOrder._id

            // So: Fetch RZPAY order -> get receipt -> update DB.
            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
            if (orderInfo.status === 'paid' || orderInfo.status === 'attempted') {
                await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
                await userModel.findByIdAndUpdate(userId, { cartData: {} });
                res.json({ success: true, message: "Payment Successful" });
            } else {
                res.json({ success: false, message: "Payment Failed" });
            }

        } else {
            res.json({ success: false, message: "Payment Failed" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get all orders for a specific user (for frontend)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find all orders for this user
        const orders = await orderModel.find({ userId });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get all orders for admin panel
const allOrders = async (req, res) => {
    try {
        // Get all orders from database
        const orders = await orderModel.find({});

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update order status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status, adminRemark } = req.body;

        // Validate inputs
        if (!orderId || !status) {
            return res.json({ success: false, message: "Order ID and status are required" });
        }

        // Update order status, remark and timestamp
        await orderModel.findByIdAndUpdate(orderId, {
            status,
            adminRemark: adminRemark || '',
            statusUpdatedAt: Date.now()
        });

        res.json({ success: true, message: "Status Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
}

export { placeOrder, placeOrderRazorpay, verifyRazorpay, userOrders, allOrders, updateStatus };
