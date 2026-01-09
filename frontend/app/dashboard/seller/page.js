"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiGet } from "@/services/apiClient";
import SellerListingCard from "@/components/cards/SellerListingCard";
import SellerLayout from "@/components/layouts/SellerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function SellerDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await apiGet("/seller/listings");
        setListings(data.data || data || []);
      } catch (err) {
        console.error("Failed to fetch listings", err);
        // Don't show error if it's just auth redirect happening
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

  return (
    <ProtectedLayout allowedRoles={["seller"]}>
      <SellerLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600">Manage your waste listings and track sales.</p>
            </div>
            <Link
              href="/dashboard/seller/sell"
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                user?.status !== 'approved' && user?.status !== 'active' 
                  ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                  : ''
              }`}
              aria-disabled={user?.status !== 'approved'}
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Sell New Item
            </Link>
          </div>

          {loading ? (
             <div className="flex justify-center items-center min-h-[50vh]">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
             </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No listings yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first listing.</p>
              <div className="mt-6">
                <Link
                  href="/dashboard/seller/sell"
                  className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 ${
                    user?.status !== 'approved' && user?.status !== 'active'
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : ''
                  }`}
                >
                  Sell New Item
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {listings.map((listing) => (
                <SellerListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </SellerLayout>
    </ProtectedLayout>
  );
}
