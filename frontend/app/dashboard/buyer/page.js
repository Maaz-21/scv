"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/apiClient";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import ListingCard from "@/components/cards/ListingCard";

export default function BuyerDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketplace();
  }, []);

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      const response = await apiGet("/buyer/marketplace");
      if (response && response.success) {
        setListings(response.data);
      } else if (response && response.data) {
         setListings(response.data); // Fallback if structure is slightly different
      }
    } catch (err) {
      console.error("Failed to fetch marketplace:", err);
      // Don't set error if it's just a redirect/auth issue that ProtectedLayout will handle
      if (err.status !== 401) {
          setError("Failed to load marketplace listings.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout allowedRoles={["buyer"]}>
      <BuyerLayout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="mt-1 text-sm text-gray-500">Browse and purchase verified scrap materials.</p>
        </div>

        {loading ? (
             <div className="flex justify-center p-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
             </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </BuyerLayout>
    </ProtectedLayout>
  );
}
