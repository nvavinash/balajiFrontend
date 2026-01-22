import { createContext, useEffect } from "react";
import { products } from "../assets/assets";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Create context for global shop state
export const ShopContext = createContext();

/**
 * ShopContextProvider
 * Manages global state for the e-commerce application
 * Handles: products, cart, search, authentication
 */
const ShopContextProvider = (props) => {
  // Constants
  const currency = "₹";
  const delivery_fee = 60;
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // Navigation hook
  const navigate = useNavigate();

  // State management
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // Authentication state - persisted in localStorage
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ""
  );

  /**
   * Sync token with localStorage whenever it changes
   */
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  /**
   * Add item to cart
   * @param {String} itemId - Product ID
   * @param {String} size - Selected size
   */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // Clone current cart to avoid mutation
    let cartData = structuredClone(cartItems);

    // Add or increment item
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  /**
   * Get total number of items in cart
   * @returns {Number} Total count
   */
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error("Error calculating cart count:", error);
        }
      }
    }
    return totalCount;
  };

  /**
   * Update quantity of item in cart
   * @param {String} itemId - Product ID
   * @param {String} size - Size
   * @param {Number} quantity - New quantity
   */
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  /**
   * Calculate total cart amount
   * @returns {Number} Total amount
   */
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += cartItems[items][item] * itemInfo.price;
          }
        } catch (error) {
          console.error("Error calculating cart amount:", error);
        }
      }
    }
    return totalAmount;
  };

  /**
   * Logout user
   * Clears token and cart, redirects to login
   */
  const logout = () => {
    setToken("");
    localStorage.removeItem('token');
    setCartItems({});
    navigate('/login');
    toast.info("Logged out successfully");
  };

  // Context value object - all shared state and functions
  const value = {
    // Product data
    products,

    // Constants
    currency,
    delivery_fee,
    backendUrl,

    // Search state
    search,
    setSearch,
    showSearch,
    setShowSearch,

    // Cart state and functions
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,

    // Auth state and functions
    token,
    setToken,
    logout,

    // Navigation
    navigate
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
