"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/services/apiClient";
import SellerListingCard from "@/components/cards/SellerListingCard";
import SellerLayout from "@/components/layouts/SellerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { Plus, Package, Clock, CheckCircle, BarChart3, Filter } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await apiGet("/seller/listings");
        setListings(data.data || data || []);
      } catch (err) {
        console.error("Failed to fetch listings", err);
        if (err.status !== 401) {
             setError("Failed to load your listings.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchListings();
    }
  }, [user]);

  // Derived State (Client-Side Filtering)
  const pendingCount = listings.filter(l => l.status === 'submitted' || l.status === 'admin_approved').length;
  const liveCount = listings.filter(l => ['inspection_passed', 'live'].includes(l.status)).length;
  const soldCount = listings.filter(l => l.status === 'sold').length;
  const totalEarnings = listings.filter(l => l.status === 'sold').reduce((sum, item) => sum + (item.price || 0), 0);
  const totalCount = listings.length;

  const filteredListings = listings.filter(listing => {
      if (activeTab === 'all') return true;
      if (activeTab === 'pending') return listing.status === 'submitted' || listing.status === 'admin_approved';
      if (activeTab === 'live') return ['inspection_passed', 'live'].includes(listing.status);
      if (activeTab === 'sold') return listing.status === 'sold';
      return true;
  });

  const StatsCard = ({ title, value, icon: Icon, color, isCurrency }) => (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-slate-900">
                  {isCurrency ? `$${value.toLocaleString()}` : value}
              </h3>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="w-6 h-6" />
          </div>
      </div>
  );

  return (
    <ProtectedLayout allowedRoles={["seller"]}>
      <SellerLayout>
        <div className="space-y-8">
          
          {/* Header & Stats */}
          <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Seller Dashboard</h1>
                  <p className="text-slate-500">Overview of your inventory and performance.</p>
                </div>
                <Link
                  href="/dashboard/seller/sell"
                  className={`inline-flex items-center px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-100 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all
                    ${user?.status !== 'approved' && user?.status !== 'active' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Sell New Item
                </Link>
              </div>

              {/* Status Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard title="Total Earnings" value={totalEarnings} icon={BarChart3} color="bg-emerald-100 text-emerald-600" isCurrency />
                  <StatsCard title="Pending Approval" value={pendingCount} icon={Clock} color="bg-amber-100 text-amber-600" />
                  <StatsCard title="Live Listings" value={liveCount} icon={CheckCircle} color="bg-indigo-100 text-indigo-600" />
                  <StatsCard title="Items Sold" value={soldCount} icon={Package} color="bg-slate-100 text-slate-600" />
              </div>
          </div>

          {/* Listings Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
              
              {/* Tabs */}
              <div className="border-b border-slate-100 px-6 pt-6">
                  <div className="flex space-x-6 overflow-x-auto no-scrollbar">
                      {['all', 'pending', 'live', 'sold'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap px-1 ${
                                activeTab === tab 
                                ? "border-indigo-600 text-indigo-600" 
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                          >
                              {tab.charAt(0).toUpperCase() + tab.slice(1)} Listings
                          </button>
                      ))}
                  </div>
              </div>

              {/* Content */}
              <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col justify-center items-center py-20 text-slate-400">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                        <p>Loading inventory...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                  ) : filteredListings.length === 0 ? (
                    <div className="text-center py-20">
                         <div className="bg-slate-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                             <Package className="w-10 h-10 text-slate-300" />
                         </div>
                         <h3 className="text-lg font-bold text-slate-900 mb-1">No listings found</h3>
                         <p className="text-slate-500 mb-6">There are no {activeTab !== 'all' ? activeTab : ''} items in your inventory.</p>
                         {activeTab === 'all' && (
                             <Link href="/dashboard/seller/sell" className="text-indigo-600 font-medium hover:text-indigo-800">
                                 Create your first listing &rarr;
                             </Link>
                         )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {filteredListings.map((listing) => (
                            <SellerListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                  )}
              </div>
          </div>
        </div>
      </SellerLayout>
    </ProtectedLayout>
  );
}
