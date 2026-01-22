import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Package, ShoppingBag, DollarSign, Users } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('admin_token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Orders for stats and chart
                const ordersRes = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
                const productsRes = await axios.get(backendUrl + '/api/product/list');

                if (ordersRes.data.success) {
                    const orders = ordersRes.data.orders;
                    const revenue = orders.reduce((acc, curr) => acc + curr.amount, 0);

                    setStats(prev => ({
                        ...prev,
                        totalOrders: orders.length,
                        totalRevenue: revenue,
                        totalProducts: productsRes.data.success ? productsRes.data.products.length : 0
                    }));

                    // Prepare chart data (Sales by date)
                    const salesMap = {};
                    orders.forEach(order => {
                        const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        salesMap[date] = (salesMap[date] || 0) + order.amount;
                    });

                    const formattedData = Object.keys(salesMap).map(date => ({
                        date,
                        sales: salesMap[date]
                    })).slice(-10); // Last 10 days

                    setChartData(formattedData);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-full ${color} text-white`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
            </div>
        </div>
    );

    if (loading) return <div className='p-10 text-center'>Loading Dashboard...</div>;

    return (
        <div className="pt-10 pb-20">
            <h3 className="text-2xl font-bold mb-8">Admin Dashboard Overview</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Revenue"
                    value={`Rs. ${stats.totalRevenue}`}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Orders"
                    value={stats.totalOrders}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="bg-purple-500"
                />
                <StatCard
                    title="User Base"
                    value="Active"
                    icon={Users}
                    color="bg-orange-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold mb-6 text-gray-700">Recent Sales Trend</h4>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold mb-6 text-gray-700">Orders Distribution</h4>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
