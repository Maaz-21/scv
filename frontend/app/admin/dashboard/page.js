"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet } from "@/services/apiClient";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSellers: 0,
    pendingListings: 0,
    liveItems: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiGet("/admin/dashboard");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        if (err.status !== 401) {
            setError("Failed to load dashboard statistics.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Sellers', value: stats.totalSellers, icon: 'UsersIcon', color: 'bg-indigo-500' },
    { name: 'Pending Listings', value: stats.pendingListings, icon: 'ClockIcon', color: 'bg-yellow-500' },
    { name: 'Live Items', value: stats.liveItems, icon: 'CheckCircleIcon', color: 'bg-green-500' },
    { name: 'Total Orders', value: stats.totalOrders, icon: 'ShoppingBagIcon', color: 'bg-blue-500' },
  ];

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
            {loading ? (
               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                   {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>)}
               </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                      <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                      </div>
                  </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                  <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`rounded-md p-3 ${card.color}`}>
                             {/* Icon placeholder since we don't have heroicons component imported directly yet */}
                             <span className="text-white font-bold text-xl">{card.name[0]}</span>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{card.value}</div>
                            </dd>
                          </dl>
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
