"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiPost } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmationModal from "./ConfirmationModal";
import toast from "react-hot-toast";

export default function ItemDetails({ item }) {
  const { user, role, isAuthenticated } = useAuth();
  const router = useRouter();
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
      _id,
      title, 
      description, 
      price, 
      images, 
      category, 
      estimatedWeight, 
      location,
      status
  } = item;

  const handleBuyClick = () => {
      setShowConfirmModal(true);
  };

  const handlePurchase = async () => {
      setShowConfirmModal(false);
      setBuying(true);
      setError(null);
      
      try {
          await apiPost(`/marketplace/order/${_id}`, {});
          toast.success("Order placed successfully!");
          // Specific redirect instruction from requirement: /dashboard/buyer/orders
          router.push("/dashboard/buyer/orders");
      } catch (err) {
          console.error("Purchase failed:", err);
          const msg = err.message || "Failed to place order. Please try again.";
          toast.error(msg);
          setError(msg);
          setBuying(false);
      }
  };

  // Simple image carousel (just first image for MVP, or grid)
  const isAvailable = status === 'live' || status === 'inspection_passed' || status === 'admin_approved'; // Updated to include inspection_passed

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="p-4 md:p-6 bg-gray-50 flex items-center justify-center">
            {images && images.length > 0 ? (
                <div className="space-y-4 w-full">
                    {/* Main Image */}
                    <div className="aspect-w-4 aspect-h-3 w-full rounded-lg overflow-hidden bg-gray-200">
                        <img 
                            src={images[0]} 
                            alt={title} 
                            className="object-cover w-full h-full"
                        />
                    </div>
                    {/* Thumbnails if multiple (simplified) */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {images.slice(1).map((img, idx) => (
                                <div key={idx} className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-200">
                                     <img src={img} alt={`${title} ${idx}`} className="object-cover w-full h-full" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-64 w-full flex items-center justify-center bg-gray-200 text-gray-400 rounded-lg">
                    No Images Available
                </div>
            )}
        </div>

        {/* Details Section */}
        <div className="p-6 md:pr-8">
             <div className="mb-4">
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {typeof category === 'object' ? category.name : "Scrap Category"}
                 </span>
                 {location && (
                     <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        📍 {location}
                     </span>
                 )}
             </div>

             <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
             <p className="text-4xl font-bold text-blue-600 mb-6">${price.toLocaleString()}</p>

             <div className="prose prose-sm text-gray-500 mb-8">
                 <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-2">Description</h3>
                 <p className="whitespace-pre-line">{description}</p>
             </div>

             <div className="border-t border-gray-200 pt-6 mb-8">
                 <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                     <div>
                         <dt className="text-sm font-medium text-gray-500">Estimated Weight</dt>
                         <dd className="mt-1 text-lg font-semibold text-gray-900">{estimatedWeight} kg</dd>
                     </div>
                     <div>
                         <dt className="text-sm font-medium text-gray-500">Status</dt>
                         <dd className="mt-1 text-base font-medium text-gray-900 capitalize">{status.replace('_', ' ')}</dd>
                     </div>
                 </dl>
             </div>
             
             {error && (
                 <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                 </div>
             )}

             <div className="mt-6">
                 {isAuthenticated && role === "buyer" ? (
                     <button
                        onClick={handleBuyClick}
                        disabled={buying || !isAvailable}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
                            !isAvailable 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        } ${buying ? "opacity-75 cursor-wait" : ""}`}
                     >
                         {buying ? "Processing Order..." : isAvailable ? "Buy Now" : "Item Unavailable"}
                     </button>
                 ) : (
                     <div className="rounded-md bg-gray-50 p-4 border border-gray-200 text-center">
                         {!isAuthenticated ? (
                             <>
                                 <p className="text-sm text-gray-600 mb-3">Login as a buyer to purchase this item.</p>
                                 <Link href="/login" className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                                     Login to Buy
                                 </Link>
                             </>
                         ) : (
                             <p className="text-sm text-gray-600">
                                 Logged in as <strong>{role}</strong>. Only buyers can purchase items.
                             </p>
                         )}
                     </div>
                 )}
             </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handlePurchase}
        title="Confirm Purchase"
        message={`Are you sure you want to purchase "${title}" for $${price?.toLocaleString()}?`}
        confirmText="Yes, Purchase"
        cancelText="No, Cancel"
      />
    </div>
  );
}
