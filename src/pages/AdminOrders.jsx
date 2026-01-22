import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterMethod, setFilterMethod] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('admin_token');

    const fetchAllOrders = async () => {
        try {
            const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const status = event.target.value;
            const remark = window.prompt("Enter admin remark (optional):", "");

            const response = await axios.post(backendUrl + '/api/order/status', {
                orderId,
                status,
                adminRemark: remark
            }, { headers: { token } });

            if (response.data.success) {
                await fetchAllOrders();
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const downloadInvoice = (order) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text("INVOICE", 105, 20, { align: 'center' });

        doc.setFontSize(5);
        doc.text(`Purchase ID: ${order.purchaseId}`, 20, 40);
        doc.text(`Order ID: ${order._id}`, 20, 45);
        doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 20, 50);

        // Customer Info
        doc.setFontSize(12);
        doc.text("Customer Details:", 20, 65);
        doc.setFontSize(10);
        doc.text(`${order.address.firstName} ${order.address.lastName}`, 20, 72);
        doc.text(`${order.address.street}, ${order.address.city}`, 20, 77);
        doc.text(`${order.address.state}, ${order.address.country} - ${order.address.zipcode}`, 20, 82);
        doc.text(`Phone: ${order.address.phone}`, 20, 87);

        // Payment Info
        doc.text(`Payment Method: ${order.paymentMethod === 'Razorpay' ? 'Online' : 'COD'}`, 140, 72);
        doc.text(`Payment Status: ${order.payment ? 'Paid' : 'Pending'}`, 140, 77);

        // Items Table
        const tableData = order.items.map(item => [
            item.name,
            item.size,
            item.quantity,
            `Rs. ${item.price}`,
            `Rs. ${item.price * item.quantity}`
        ]);

        doc.autoTable({
            startY: 100,
            head: [['Item Name', 'Size', 'Qty', 'Price', 'Total']],
            body: tableData,
            theme: 'striped'
        });

        // Total
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Total Amount: Rs. ${order.amount}`, 140, finalY);

        doc.save(`Invoice_${order.purchaseId}.pdf`);
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchesMethod = filterMethod === 'All' || order.paymentMethod === filterMethod;
        const matchesSearch = order.purchaseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesMethod && matchesSearch;
    });

    return (
        <div className='pt-10'>
            <h3 className='text-2xl font-bold mb-6'>Admin Orders Dashboard</h3>

            {/* Filters Section */}
            <div className='flex flex-wrap gap-4 mb-8 bg-gray-50 p-4 border rounded'>
                <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-gray-500'>Search ID</label>
                    <input
                        type="text"
                        placeholder="Search by Purchase ID"
                        className='border px-3 py-1.5 rounded text-sm w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-gray-500'>Status</label>
                    <select className='border px-3 py-1.5 rounded text-sm' value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-xs font-bold text-gray-500'>Payment Method</label>
                    <select className='border px-3 py-1.5 rounded text-sm' value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
                        <option value="All">All Methods</option>
                        <option value="COD">COD</option>
                        <option value="Razorpay">Razorpay</option>
                        <option value="Stripe">Stripe</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className='overflow-x-auto shadow-sm border rounded'>
                <table className='w-full text-left text-sm'>
                    <thead className='bg-gray-100 text-gray-700 font-bold'>
                        <tr>
                            <th className='px-4 py-3'>Order Info</th>
                            <th className='px-4 py-3'>Items</th>
                            <th className='px-4 py-3'>Customer</th>
                            <th className='px-4 py-3'>Payment</th>
                            <th className='px-4 py-3'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y'>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-10">Loading orders...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10">No orders found matching filters.</td></tr>
                        ) : filteredOrders.map((order, index) => (
                            <tr key={index} className='hover:bg-gray-50 align-top'>
                                <td className='px-4 py-4'>
                                    <p className='font-bold text-black'>{order.purchaseId}</p>
                                    <p className='text-xs text-gray-400'>{new Date(order.date).toDateString()}</p>
                                    <p className='mt-2 font-medium'>Rs. {order.amount}</p>
                                </td>
                                <td className='px-4 py-4 min-w-[200px]'>
                                    {order.items.map((item, idx) => (
                                        <div className='flex gap-2' key={idx}>
                                            <img src={item.image} alt="" className='size-10' />
                                            <p className='py-0.5 text-xs'>
                                                {item.name} x {item.quantity} <span>{item.size}</span>
                                            </p>
                                        </div>

                                    ))}
                                </td>
                                <td className='px-4 py-4'>
                                    <p className='font-medium'>{order.address.firstName} {order.address.lastName}</p>
                                    <p className='text-xs'>{order.address.city}, {order.address.state}</p>
                                    <p className='text-xs text-gray-500'>{order.address.phone}</p>
                                </td>
                                <td className='px-4 py-4'>
                                    <p className='text-xs font-bold'>{order.paymentMethod}</p>
                                    <p className={`text-xs mt-1 ${order.payment ? 'text-green-500' : 'text-orange-500'}`}>
                                        {order.payment ? 'Paid' : 'Pending'}
                                    </p>
                                </td>
                                <td className='px-4 py-4'>
                                    <div className='flex flex-col gap-2'>
                                        <select
                                            onChange={(e) => statusHandler(e, order._id)}
                                            value={order.status}
                                            className='border p-1 rounded text-xs w-full bg-white'
                                        >
                                            <option value="Order Placed">Order Placed</option>
                                            <option value="Packing">Packing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Out for delivery">Out for delivery</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                        <button
                                            onClick={() => window.open(`/admin/invoice/${order._id}`, '_blank')}
                                            className='bg-gray-800 text-white px-2 py-1 rounded text-xs hover:bg-black transition-colors'
                                        >
                                            Print Invoice
                                        </button>
                                        {order.adminRemark && (
                                            <p className='text-[10px] text-gray-400 italic mt-1'>
                                                Remark: {order.adminRemark}
                                            </p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
