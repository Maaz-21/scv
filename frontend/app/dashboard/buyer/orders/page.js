"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/apiClient";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import OrderCard from "@/components/cards/OrderCard";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiGet("/buyer/orders"); 
      
      if (response && (response.success || Array.isArray(response))) {
         const data = response.data || response;
         setOrders(Array.isArray(data) ? data : []);
      } else {
         setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      if (err.status !== 401) {
          setError("Failed to load your orders history.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout allowedRoles={["buyer"]}>
      <BuyerLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Track past purchases and upcoming pickups.</p>
        </div>

        {loading ? (
             <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
             </div>
        ) : error ? (
            <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
                {error}
            </div>
        ) : orders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">When you buy items, they will appear here.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))}
            </div>
        )}
      </BuyerLayout>
    </ProtectedLayout>
  );
}
