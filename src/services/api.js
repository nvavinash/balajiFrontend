import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for API - can be changed based on environment
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.token = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
                toast.error('Session expired. Please login again.');
            } else if (status === 403) {
                toast.error('You do not have permission to perform this action.');
            } else if (status === 404) {
                toast.error('Resource not found.');
            } else if (status >= 500) {
                toast.error('Server error. Please try again later.');
            } else if (data?.message) {
                toast.error(data.message);
            }
        } else if (error.request) {
            // Request made but no response received
            toast.error('Network error. Please check your connection.');
        } else {
            // Something else happened
            toast.error('An unexpected error occurred.');
        }

        return Promise.reject(error);
    }
);

// ============================================
// AUTH API CALLS
// ============================================

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise} - { success, token }
 */
export const registerUser = async (userData) => {
    const response = await apiClient.post('/api/user/register', userData);
    return response.data;
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - { success, token }
 */
export const loginUser = async (credentials) => {
    const response = await apiClient.post('/api/user/login', credentials);
    return response.data;
};

/**
 * Admin login
 * @param {Object} credentials - { email, password }
 * @returns {Promise} - { success, token }
 */
export const adminLogin = async (credentials) => {
    const response = await apiClient.post('/api/user/admin', credentials);
    return response.data;
};

// ============================================
// PRODUCT API CALLS (Placeholder for future)
// ============================================

/**
 * Get all products
 * @returns {Promise} - { success, products }
 */
export const getAllProducts = async () => {
    const response = await apiClient.get('/api/product/list');
    return response.data;
};

/**
 * Get single product by ID
 * @param {String} productId
 * @returns {Promise} - { success, product }
 */
export const getProductById = async (productId) => {
    const response = await apiClient.post('/api/product/single', { productId });
    return response.data;
};

/**
 * Add new product (Admin only)
 * @param {Object} productData
 * @returns {Promise} - { success, message }
 */
export const addProduct = async (productData) => {
    const response = await apiClient.post('/api/product/add', productData);
    return response.data;
};

/**
 * Remove product (Admin only)
 * @param {String} productId
 * @returns {Promise} - { success, message }
 */
export const removeProduct = async (productId) => {
    const response = await apiClient.post('/api/product/remove', { productId });
    return response.data;
};

// ============================================
// CART API CALLS (Placeholder for future)
// ============================================

/**
 * Get user's cart
 * @returns {Promise} - { success, cartData }
 */
export const getUserCart = async () => {
    const response = await apiClient.post('/api/cart/get');
    return response.data;
};

/**
 * Add item to cart
 * @param {String} itemId
 * @param {String} size
 * @returns {Promise} - { success, message }
 */
export const addToCart = async (itemId, size) => {
    const response = await apiClient.post('/api/cart/add', { itemId, size });
    return response.data;
};

/**
 * Update cart item quantity
 * @param {String} itemId
 * @param {String} size
 * @param {Number} quantity
 * @returns {Promise} - { success, message }
 */
export const updateCartItem = async (itemId, size, quantity) => {
    const response = await apiClient.post('/api/cart/update', { itemId, size, quantity });
    return response.data;
};

// ============================================
// ORDER API CALLS (Placeholder for future)
// ============================================

/**
 * Place order (COD)
 * @param {Object} orderData
 * @returns {Promise} - { success, message }
 */
export const placeOrder = async (orderData) => {
    const response = await apiClient.post('/api/order/place', orderData);
    return response.data;
};

/**
 * Initialize Razorpay Payment
 * @param {Object} orderData
 * @returns {Promise} - { success, order }
 */
export const initRazorpayPayment = async (orderData) => {
    const response = await apiClient.post('/api/order/razorpay', orderData);
    return response.data;
};

/**
 * Verify Razorpay Payment
 * @param {Object} paymentData
 * @returns {Promise} - { success, message }
 */
export const verifyRazorpayPayment = async (paymentData) => {
    const response = await apiClient.post('/api/order/verifyRazorpay', paymentData);
    return response.data;
};

/**
 * Get user's orders
 * @returns {Promise} - { success, orders }
 */
export const getUserOrders = async () => {
    const response = await apiClient.post('/api/order/userorders');
    return response.data;
};

/**
 * Get all orders (Admin only)
 * @returns {Promise} - { success, orders }
 */
export const getAllOrders = async () => {
    const response = await apiClient.post('/api/order/list');
    return response.data;
};

/**
 * Update order status (Admin only)
 * @param {String} orderId
 * @param {String} status
 * @returns {Promise} - { success, message }
 */
export const updateOrderStatus = async (orderId, status) => {
    const response = await apiClient.post('/api/order/status', { orderId, status });
    return response.data;
};

export default apiClient;
