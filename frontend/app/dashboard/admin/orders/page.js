'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/services/apiClient';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '@/components/AdminNavbar';

const ORDER_STATUSES = ['initiated', 'confirmed', 'pickup_scheduled', 'picked', 'completed'];

export default function OrdersManagementPage() {
    const router = useRouter();
    const { role, isAuthenticated, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }
            if (role !== 'admin') {
                router.push('/');
                return;
            }
            fetchOrders();
        }
    }, [authLoading, isAuthenticated, role, router]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await apiGet('/admin/orders');
            setOrders(response.data || response.orders || []);
        } catch (err) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await apiPost(`/admin/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
            alert('Order status updated successfully!');
        } catch (err) {
            alert(err.message || 'Failed to update order status');
        }
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F32]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminNavbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#FF7F32]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-2 text-gray-800">Orders Management</h1>
                                <p className="text-gray-600">View and manage all marketplace orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 bg-white rounded-xl shadow-md p-6 border-l-4 border-[#FF7F32]">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Filter by Status</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full md:w-64 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F32] focus:border-transparent bg-white text-gray-900 font-semibold shadow-sm hover:border-[#FF7F32] transition-colors duration-200"
                    >
                        <option value="all" className="text-gray-900">All Orders</option>
                        {ORDER_STATUSES.map(status => (
                            <option key={status} value={status} className="text-gray-900">{formatStatus(status)}</option>
                        ))}
                    </select>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-[#FF7F32]">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-gray-500 text-xl font-semibold">No orders found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your filter</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-[#FF7F32]">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Buyer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Listing
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {filteredOrders.map((order) => (
                                        <OrderRow
                                            key={order._id}
                                            order={order}
                                            onUpdateStatus={updateOrderStatus}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderRow({ order, onUpdateStatus }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setIsUpdating(true);
        await onUpdateStatus(order._id, newStatus);
        setIsUpdating(false);
    };

    const getNextStatus = (currentStatus) => {
        const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
        if (currentIndex < ORDER_STATUSES.length - 1) {
            return ORDER_STATUSES[currentIndex + 1];
        }
        return null;
    };

    const nextStatus = getNextStatus(order.status);

    return (
        <tr className="hover:bg-orange-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-bold text-[#0A2E52]">#{order._id.slice(-8)}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7F32] to-[#ff9d5c] flex items-center justify-center text-white font-bold text-xs mr-2">
                        {(typeof order.buyerId === 'object' ? order.buyerId?.name : order.buyerId || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                        {typeof order.buyerId === 'object' ? order.buyerId?.name : order.buyerId || 'Unknown'}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {typeof order.listingId === 'object' ? order.listingId?.title : order.listingId || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-base font-bold text-[#FF7F32]">₹{order.amount}</span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={order.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {nextStatus ? (
                    <button
                        onClick={() => handleStatusChange(nextStatus)}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-gradient-to-r from-[#0A2E52] to-[#0d3a63] text-white rounded-lg hover:from-[#0d3a63] hover:to-[#0A2E52] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                    >
                        {isUpdating ? 'Updating...' : `→ ${formatStatus(nextStatus)}`}
                    </button>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        ✓ Done
                    </span>
                )}
            </td>
        </tr>
    );
}

function StatusBadge({ status }) {
    const statusConfig = {
        initiated: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: '🕒' },
        confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: '✓' },
        pickup_scheduled: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: '📅' },
        picked: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', icon: '📦' },
        completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: '✓' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: '•' };

    return (
        <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full border-2 ${config.bg} ${config.text} ${config.border}`}>
            <span className="mr-1">{config.icon}</span>
            {formatStatus(status)}
        </span>
    );
}

function formatStatus(status) {
    return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}
