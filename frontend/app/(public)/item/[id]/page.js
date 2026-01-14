"use client";

import { use, useEffect, useState } from "react";
import { apiGet } from "@/services/apiClient";
import ItemDetails from "@/components/ui/ItemDetails";
import Navbar from "@/components/layouts/Navbar";

// Note: In Next.js App Router, dynamic params are passed to the page component
export default function ItemPage({ params }) {
  const { id } = use(params);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
        fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await apiGet(`/buyer/listing/${id}`);
      if (response.success) {
        setItem(response.data);
      } else {
        setError("Item not found");
      }
    } catch (err) {
      console.error("Error fetching item:", err);
      setError("Failed to load item details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        </div>
    );
  }

  if (error || !item) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
                    <p className="text-gray-600">{error || "The item you are looking for does not exist or has been removed."}</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24 lg:pt-32 w-full">
         <ItemDetails item={item} />
      </main>
    </div>
  );
}
