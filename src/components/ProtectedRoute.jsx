import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
    const { token } = useContext(ShopContext);

    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
