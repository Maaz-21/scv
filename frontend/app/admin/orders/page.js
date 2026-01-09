"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet, apiPost, apiPostForm, apiPatch } from "@/services/apiClient";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'schedule' or 'proof'

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

  const handleStatusUpdate = async (id, status) => {
    try {
      await apiPatch(`/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status");
    }
  };

  const submitSchedule = async (e) => {
    e.preventDefault();
    try {
      await apiPost(`/pickup/${selectedOrder._id}/schedule`, { scheduledDate: scheduleDate });
      setModalAction(null);
      fetchOrders();
    } catch (err) {
      console.error("Schedule failed", err);
      alert("Failed to schedule pickup");
    }
  };

  const submitProof = async (e) => {
    e.preventDefault();
    if (!proofFile) return;
    try {
        const fd = new FormData();
        fd.append("proofImage", proofFile);
        await apiPostForm(`/pickup/${selectedOrder._id}/proof`, fd);
        setModalAction(null);
        fetchOrders();
    } catch(err) {
        console.error("Proof upload failed", err);
        alert("Failed to upload proof");
    }
  };

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          {loading ? (
             <div className="flex justify-center p-10">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
             </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 bg-white shadow rounded-lg">
                <p className="text-gray-500 text-lg">No orders found.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
               <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                    <li key={order._id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">{order._id}</p>
                                <p className="text-sm text-gray-500">
                                    Item: <span className="font-semibold">{order.listingId?.title || "Unknown Item"}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Buyer: {order.buyerId?.name} ({order.buyerId?.email})
                                </p>
                                <p className="text-sm text-gray-500">
                                    Amount: ${order.amount}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                      'bg-blue-100 text-blue-800'}`}>
                                    {order.status.replace('_', ' ').toUpperCase()}
                                </span>
                                
                                <div className="flex gap-2">
                                    {order.status === 'confirmed' && (
                                        <button 
                                            onClick={() => { setSelectedOrder(order); setModalAction("schedule"); }}
                                            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                        >
                                            Schedule Pickup
                                        </button>
                                    )}
                                    {order.status === 'pickup_scheduled' && (
                                         <div className="flex gap-1">
                                            <span className="text-xs text-gray-500 self-center">Pickup on: {new Date(order.pickupDate).toLocaleDateString()}</span>
                                            <button 
                                                onClick={() => { setSelectedOrder(order); setModalAction("proof"); }}
                                                className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                                            >
                                                Upload Proof
                                            </button>
                                         </div>
                                    )}
                                    {order.status === 'picked' && (
                                         <button 
                                            onClick={() => handleStatusUpdate(order._id, "completed")}
                                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                         >
                                            Mark Completed
                                         </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
               </ul>
            </div>
          )}
        </div>
      </div>

        {modalAction === "schedule" && (
            <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                    <h3 className="text-lg font-bold mb-4">Schedule Pickup</h3>
                    <form onSubmit={submitSchedule}>
                        <input 
                            type="datetime-local" 
                            required 
                            className="w-full border rounded p-2 mb-4"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setModalAction(null)} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Schedule</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {modalAction === "proof" && (
            <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                    <h3 className="text-lg font-bold mb-4">Upload Pickup Proof</h3>
                    <form onSubmit={submitProof}>
                        <input 
                            type="file" 
                            required 
                            accept="image/*"
                            className="w-full mb-4"
                            onChange={(e) => setProofFile(e.target.files[0])}
                        />
                         <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setModalAction(null)} className="px-4 py-2 text-gray-600">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Upload</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </AdminLayout>
    </ProtectedLayout>
  );
}
