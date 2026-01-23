import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * AdminNavbar Component
 * 
 * Dedicated navigation bar for admin users only.
 * Shows admin-specific links and logout functionality.
 * Replaces the user navbar on admin routes.
 */
const AdminNavbar = () => {
    const navigate = useNavigate();

    /**
     * Handle admin logout
     * Clears admin token from localStorage and redirects to admin login
     */
    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        toast.info('Admin logged out successfully');
        navigate('/admin/login');
    };

    return (
        <div className="bg-white border-b sticky top-0 z-50">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                {/* Logo / Brand */}
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                    <div className="bg-black text-white px-3 py-1 rounded font-bold text-lg">
                        ADMIN
                    </div>
                    <span className="text-gray-600 text-sm hidden sm:inline">Panel</span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center gap-1 sm:gap-4">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                    >
                        <LayoutDashboard size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>

                    <Link
                        to="/admin/products"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                    >
                        <Package size={18} />
                        <span className="hidden sm:inline">Products</span>
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                    >
                        <ShoppingCart size={18} />
                        <span className="hidden sm:inline">Orders</span>
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors text-sm font-medium text-red-600 hover:text-red-700 ml-2"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default AdminNavbar;
