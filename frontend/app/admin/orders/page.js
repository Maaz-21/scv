"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet, apiPatch } from "@/services/apiClient";
import { Package, Truck, CheckCircle, Clock, ShoppingBag, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiGet("/admin/orders");
      // Backend returns { message, count, orders: [...] }
      setOrders(data.orders || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setLoading(false);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const submitStatusUpdate = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    setUpdatingId(orderId);
    try {
      await apiPatch(`/admin/orders/${orderId}/status`, { status: newStatus });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Clear pending update
      const updates = { ...statusUpdates };
      delete updates[orderId];
      setStatusUpdates(updates);
      
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status: " + (err.message || "Unknown error"));
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = [
    { value: "initiated", label: "Initiated" },
    { value: "confirmed", label: "Confirmed" },
    { value: "pickup_scheduled", label: "Pickup Scheduled" },
    { value: "picked", label: "Picked Up" },
    { value: "completed", label: "Completed" }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'initiated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'pickup_scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'picked': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-2 text-sm text-gray-600">Track and update the status of buyer orders.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          {loading ? (
             <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>)}
             </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white shadow-sm rounded-xl border border-dashed border-gray-300">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-sm text-gray-500">Orders placed by buyers will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            Order #{order._id.slice(-6)}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status.replace(/_/g, " ").toUpperCase()}
                                            </span>
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">${order.amount}</p>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Details Column */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Item Details</h4>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{order.listingId?.title || "Unknown Item"}</p>
                                                <p className="text-sm text-gray-500">{order.listingId?.category?.name || "Category"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Buyer</h4>
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">{order.buyerId?.name || "Unknown"}</p>
                                                <p className="text-gray-500">{order.buyerId?.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</h4>
                                            <p className="text-sm text-gray-900">{order.listingId?.location || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Column */}
                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col justify-center">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-gray-500" /> Update Status
                                    </h4>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <select
                                                value={statusUpdates[order._id] || order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                disabled={order.status === 'completed' || updatingId === order._id}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-3 pr-10 py-2.5 disabled:bg-gray-100 disabled:text-gray-400"
                                            >
                                                {statusOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <button
                                            onClick={() => submitStatusUpdate(order._id)}
                                            disabled={
                                                !statusUpdates[order._id] || 
                                                statusUpdates[order._id] === order.status || 
                                                updatingId === order._id
                                            }
                                            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {updatingId === order._id ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                <>Save Update</>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Changing status will notify buyer and seller dashboards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      </div>
      </AdminLayout>
    </ProtectedLayout>
  );
}                                        