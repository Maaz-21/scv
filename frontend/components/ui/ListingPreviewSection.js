"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/apiClient";
import ListingPreviewCard from "../cards/ListingPreviewCard";
import Link from "next/link";

export default function ListingPreviewSection() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await apiGet("/buyer/marketplace?preview=true");
      if (response.success) {
        setListings(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError("Failed to load listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Recently Verified Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  if (error) {
     // Quiet fail for homepage is often better, but showing nothing or minimal text is fine.
     return null; 
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Recently Verified Items</h2>
          {listings.length > 0 && (
             <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                View All &rarr;
             </Link>
          )}
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No verified items are currently available for preview.</p>
            <p className="text-gray-400">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingPreviewCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
