import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminInvoice = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const token = localStorage.getItem('admin_token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Since we don't have a single order fetch by ID for admin specifically, 
                // we fetch all and find the one. Efficient for now, but usually needs a separate API.
                const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } });
                if (response.data.success) {
                    const foundOrder = response.data.orders.find(o => o._id === orderId);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        toast.error("Order not found");
                        navigate('/admin/orders');
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (token && orderId) {
            fetchOrder();
        }
    }, [orderId, token]);

    if (loading) return <div className='p-10 text-center'>Loading Invoice...</div>;
    if (!order) return null;

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white shadow-lg my-10 print:shadow-none print:my-0 print:p-0" id="printable-area">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
                    <p className="text-gray-500 mt-2">Purchase ID: {order.purchaseId}</p>
                    <p className="text-gray-500">Order ID: {order._id}</p>
                    <p className="text-gray-500">Date: {new Date(order.date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold text-black">NV Collections</h2>
                    <p className="text-gray-500">Official Store</p>
                    <button
                        onClick={() => window.print()}
                        className="mt-4 bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800 transition-colors print:hidden"
                    >
                        Print Invoice
                    </button>
                </div>
            </div>

            {/* Customer & Payment Info */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To:</h3>
                    <p className="text-lg font-bold text-gray-800">{order.address.firstName} {order.address.lastName}</p>
                    <p className="text-gray-600">{order.address.street}</p>
                    <p className="text-gray-600">{order.address.city}, {order.address.state}</p>
                    <p className="text-gray-600">{order.address.country} - {order.address.zipcode}</p>
                    <p className="text-gray-600">Phone: {order.address.phone}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Details:</h3>
                    <p className="text-gray-800"><span className="font-bold">Method:</span> {order.paymentMethod}</p>
                    <p className="text-gray-800">
                        <span className="font-bold">Status:</span>
                        <span className={order.payment ? 'text-green-600 ml-1' : 'text-orange-600 ml-1'}>
                            {order.payment ? 'Paid' : 'Pending'}
                        </span>
                    </p>
                    <p className="text-gray-800"><span className="font-bold">Order Status:</span> {order.status}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border-collapse mb-10">
                <thead>
                    <tr className="bg-gray-100 uppercase text-xs font-bold text-gray-600">
                        <th className="px-4 py-3 border-b">Item Description</th>
                        <th className="px-4 py-3 border-b text-center">Size</th>
                        <th className="px-4 py-3 border-b text-center">Quantity</th>
                        <th className="px-4 py-3 border-b text-right">Price</th>
                        <th className="px-4 py-3 border-b text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {order.items.map((item, index) => (
                        <tr key={index} className="text-gray-800">
                            <td className="px-4 py-4">{item.name}</td>
                            <td className="px-4 py-4 text-center">{item.size}</td>
                            <td className="px-4 py-4 text-center">{item.quantity}</td>
                            <td className="px-4 py-4 text-right">Rs. {item.price}</td>
                            <td className="px-4 py-4 text-right font-bold">Rs. {item.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end pt-8 border-t">
                <div className="w-1/3">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-bold">Rs. {order.amount}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-bold">Free</span>
                    </div>
                    <div className="flex justify-between py-4 text-xl font-bold text-gray-800">
                        <span>Total</span>
                        <span>Rs. {order.amount}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-20 text-center border-t pt-8">
                <p className="text-gray-400 text-sm">Thank you for shopping with NV Collections!</p>
                <p className="text-xs text-gray-300 mt-2">This is a system-generated invoice.</p>
            </div>
        </div>
    );
};

export default AdminInvoice;
