"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet } from "@/services/apiClient";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  ShoppingBag, 
  AlertTriangle,
  Package,
  ArrowRight,
  TrendingUp,
  UserPlus
} from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState({
    stats: {
      totalSellers: 0,
      pendingSellers: 0,
      pendingListings: 0,
      liveListings: 0,
      activeOrders: 0
    },
    recent: {
      orders: [],
      listings: [],
      sellers: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiGet("/admin/dashboard");
        setData(response);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    { 
      name: 'Total Sellers', 
      value: data?.stats?.totalSellers || 0, 
      icon: Users, 
      color: 'bg-blue-500', 
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      name: 'Active Orders', 
      value: data?.stats?.activeOrders || 0, 
      icon: ShoppingBag, 
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    { 
      name: 'Live Listings', 
      value: data?.stats?.liveListings || 0, 
      icon: CheckCircle, 
      color: 'bg-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Pending Listings', 
      value: data?.stats?.pendingListings || 0, 
      icon: Clock, 
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
  ];

  const attentionItems = [
    {
      label: 'Sellers awaiting approval',
      value: data?.stats?.pendingSellers || 0,
      link: '/admin/sellers',
      urgent: (data?.stats?.pendingSellers || 0) > 0
    },
    {
      label: 'Listings awaiting inspection',
      value: data?.stats?.pendingListings || 0,
      link: '/admin/listings',
      urgent: (data?.stats?.pendingListings || 0) > 0
    },
    // Assuming active orders might need scheduling, but simplistic here
    {
      label: 'Orders in progress',
      value: data?.stats?.activeOrders || 0,
      link: '/admin/orders',
      urgent: false
    }
  ];

  if (loading) {
    return (
      <ProtectedLayout allowedRoles={["admin"]}>
        <AdminLayout>
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
             <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse shadow"></div>)}
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse lg:col-span-2"></div>
                <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
             </div>
          </div>
        </AdminLayout>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminLayout>
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Overview of platform activity and metrics.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((card) => (
              <div key={card.name} className="bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 rounded-xl border border-gray-100 p-5">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${card.bgColor} ${card.textColor}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{card.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Section */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Recent Orders */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-500" /> Recent Orders
                  </h3>
                  <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {data?.recent?.orders?.length > 0 ? (
                    data.recent.orders.map((order) => (
                      <div key={order._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.buyerId?.name || "Unknown Buyer"} • {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                             ${['completed', 'picked'].includes(order.status) ? 'bg-green-100 text-green-800' : 
                               ['initiated', 'confirmed'].includes(order.status) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                             {order.status.replace('_', ' ')}
                           </span>
                           <p className="text-sm font-semibold text-gray-900 mt-1">${order.amount}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">No recent orders found.</div>
                  )}
                </div>
              </div>

               {/* Recent Listings */}
               <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" /> Recent Listings
                  </h3>
                  <Link href="/admin/listings" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {data?.recent?.listings?.length > 0 ? (
                    data.recent.listings.map((item) => (
                      <div key={item._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                           {item.images && item.images[0] ? (
                              <img src={item.images[0]} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                           ) : (
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                <Package className="h-5 w-5" />
                              </div>
                           )}
                           <div>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.sellerId?.companyName || item.sellerId?.name}
                            </p>
                           </div>
                        </div>
                        <div>
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                             ${item.status === 'live' ? 'bg-green-100 text-green-800' : 
                               item.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                             {item.status.replace('_', ' ')}
                           </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">No recent listings found.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Attention & New Sellers */}
            <div className="space-y-8">
              
              {/* Attention Required */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-orange-50/50">
                   <h3 className="font-semibold text-orange-900 flex items-center gap-2">
                     <AlertTriangle className="h-4 w-4" /> Attention Required
                   </h3>
                </div>
                <div className="p-4 space-y-3">
                   {attentionItems.map((item, idx) => (
                     <Link key={idx} href={item.link} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${item.urgent ? 'bg-red-50 border-red-100 hover:bg-red-100' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
                        <span className={`text-sm font-medium ${item.urgent ? 'text-red-700' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`p-1 px-2 rounded-md text-xs font-bold ${item.urgent ? 'bg-red-200 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                            {item.value}
                          </span>
                          <ArrowRight className={`h-4 w-4 ${item.urgent ? 'text-red-400' : 'text-gray-400'}`} />
                        </div>
                     </Link>
                   ))}
                </div>
              </div>

              {/* New Sellers */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                     <UserPlus className="h-4 w-4 text-gray-500" /> New Sellers
                   </h3>
                   <Link href="/admin/sellers" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {data?.recent?.sellers?.length > 0 ? (
                     data.recent.sellers.map(seller => (
                       <div key={seller._id} className="px-6 py-4">
                           <div className="flex items-center justify-between">
                             <div>
                               <p className="text-sm font-medium text-gray-900">{seller.name}</p>
                               <p className="text-xs text-gray-500">{seller.companyName}</p>
                             </div>
                             <span className={`text-xs px-2 py-1 rounded-full capitalize ${seller.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                               {seller.status}
                             </span>
                           </div>
                       </div>
                     ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">No new sellers.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedLayout>
  );
}
