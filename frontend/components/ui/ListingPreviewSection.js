"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/apiClient";
import ListingPreviewCard from "../cards/ListingPreviewCard";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function ListingPreviewSection() {
  const { user, role } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await apiGet("/buyer/marketplace?preview=true&limit=6");
      if (response.success) {
        setListings(response.data.slice(0, 6));
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
    <section className="py-24 bg-slate-50" id="listings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
            >
                <h2 className="text-sm font-bold text-indigo-600 tracking-wide uppercase mb-2">Marketplace</h2>
                <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">Recently Verified Hunts</h3>
                <p className="text-slate-500 text-lg">
                    Discover quality checked scrap materials ready for immediate pickup.
                </p>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4">
             <Link 
                href={user && role === "buyer" ? "/dashboard/buyer" : "/login"} 
                className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:shadow-indigo-200"
             >
                View All Listings
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[400px]">
            {listings.map((listing, idx) => {
              return (
                <motion.div 
                    key={listing._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="col-span-1 group h-full"
                >
                   <ListingPreviewCard listing={listing} />
                </motion.div>
              );
            })}
        </div>
        
        <div className="mt-12 text-center">
             <Link href="/register" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-medium transition-colors border-b border-transparent hover:border-indigo-600 pb-0.5">
                 Load more listings
             </Link>
        </div>
      </div>
    </section>
  );
}
