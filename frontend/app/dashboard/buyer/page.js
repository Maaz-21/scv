"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/services/apiClient";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import ListingCard from "@/components/cards/ListingCard";
import link from "next/link";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";

export default function BuyerDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchMarketplace();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiGet("/buyer/categories");
      if (response && response.success) {
        const categoryNames = response.data.map(cat => cat.name);
        setCategories(["All", ...categoryNames]);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchMarketplace = async () => {
    try {
      setLoading(true);
      const response = await apiGet("/buyer/marketplace");
      if (response && response.success) {
        setListings(response.data);
      } else if (response && response.data) {
         setListings(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch marketplace:", err);
      if (err.status !== 401) {
          setError("Failed to load marketplace listings.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Filtering Logic (Client Side for MVP) ---
  
  const filteredListings = listings.filter(item => {
       const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
       
       const itemCatName = (item.category && typeof item.category === 'object') ? item.category.name : "Misc"; 
       
       const matchesCategory = selectedCategory === "All" || itemCatName === selectedCategory;

       return matchesSearch && matchesCategory;
  });

  // Split into simulated "sections" for rich UI feel
  const newArrivals = filteredListings.slice(0, 4);
  const popularMetal = filteredListings.filter(i => ((i.category && typeof i.category === 'object') ? i.category.name : "").includes("Metal")).slice(0, 3);
  const remainingItems = filteredListings.slice(4); 

  return (
    <ProtectedLayout allowedRoles={["buyer"]}>
      <BuyerLayout>
        {/* Header Search & Filter */}
        <div className="mb-10 space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>
                    <p className="text-slate-500">Find verified scrap materials, ready for pickup.</p>
                 </div>
                 {/* Search Bar */}
                 <div className="relative w-full md:w-96">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <Search className="h-5 w-5 text-slate-400" />
                     </div>
                     <input
                         type="text"
                         placeholder="Search copper, aluminum, steel..."
                         className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                     />
                 </div>
             </div>

             {/* Category Pills */}
             <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                 {categories.map((cat) => (
                     <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                            selectedCategory === cat
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                     >
                         {cat}
                     </button>
                 ))}
             </div>
        </div>

        {/* Content */}
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[...Array(4)].map((_, i) => (
                     <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
                 ))}
             </div>
        ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
               {error}
            </div>
        ) : filteredListings.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No items found</h3>
                <p className="text-slate-500">Try adjusting your search or category filters.</p>
                <button 
                    onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                    className="mt-4 text-indigo-600 font-semibold hover:text-indigo-800"
                >
                    Clear all filters
                </button>
           </div>
        ) : (
            <div className="space-y-12">
                
                {/* Section 1: Recently Added (Featured) */}
                {newArrivals.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Recently Added
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {newArrivals.map(listing => (
                                <ListingCard key={listing._id} listing={listing} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Section 2: Rest of Content (simulated infinite feed) */}
                {remainingItems.length > 0 && (
                    <section>
                         <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Discover More</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {remainingItems.map(listing => (
                                <ListingCard key={listing._id} listing={listing} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        )}
      </BuyerLayout>
    </ProtectedLayout>
  );
}
