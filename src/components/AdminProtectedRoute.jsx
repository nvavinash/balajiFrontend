import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

/**
 * AdminProtectedRoute component
 * Restricts access to admin routes by checking for a valid admin token.
 */
const AdminProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
        // If no token, redirect to admin login
        return <Navigate to="/admin/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        // Check if the token has the admin role
        if (decoded.role === 'admin') {
            return children;
        } else {
            // If not an admin, clear token and redirect
            localStorage.removeItem('admin_token');
            return <Navigate to="/admin/login" replace />;
        }
    } catch (error) {
        // If token is invalid or expired
        localStorage.removeItem('admin_token');
        return <Navigate to="/admin/login" replace />;
    }
};

export default AdminProtectedRoute;
