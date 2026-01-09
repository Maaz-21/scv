"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/apiClient";
import ListingPreviewCard from "../cards/ListingPreviewCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-64 bg-slate-200 rounded animate-pulse"></div>
               </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  if (error || listings.length === 0) {
     return null; 
  }

  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-2">Marketplace</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Recently Verified Items</h3>
          </div>
          
          <Link href="/login" className="group inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
            View Marketplace
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingPreviewCard key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
}
