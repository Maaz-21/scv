"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/services/apiClient";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import Link from "next/link";
import { ArrowLeft, Tag, MapPin, Truck, ShieldCheck, AlertCircle } from "lucide-react";

export default function BuyerItemDetailsPage({ params }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
        fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const response = await apiGet(`/buyer/listing/${id}`); 
      // Assuming endpoint is public or available to buyer
      // Note: Depending on backend, might need a buyer specific endpoint or just general listing endpoint
      if (response.success) {
        setItem(response.data);
      } else {
        setError("Item not found");
      }
    } catch (err) {
      console.error("Failed to fetch item:", err);
      setError("Failed to load item details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
      setBuying(true);
      setError(null);

      try {
          // Step 1: Create Razorpay order
          const orderResponse = await apiPost('/payment/create-order', {
              listingId: id
          });

          if (!orderResponse.success) {
              throw new Error(orderResponse.message || 'Failed to create order');
          }

          const { orderId, amount, currency, keyId, listing } = orderResponse.data;

          // Step 2: Initialize Razorpay payment
          const options = {
              key: keyId,
              amount: amount,
              currency: currency,
              name: "Scavenger Hunt",
              description: listing.title,
              image: listing.image || "/logo.png",
              order_id: orderId,
              handler: async function (response) {
                  // Step 3: Verify payment on backend
                  try {
                      const verifyResponse = await apiPost('/payment/verify', {
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature,
                          listingId: id
                      });

                      if (verifyResponse.success) {
                          alert('Payment successful! Order placed.');
                          router.push('/dashboard/buyer/orders');
                      } else {
                          throw new Error('Payment verification failed');
                      }
                  } catch (verifyErr) {
                      console.error('Verification failed:', verifyErr);
                      setError('Payment verification failed. Please contact support.');
                      setBuying(false);
                  }
              },
              prefill: {
                  name: "",
                  email: "",
                  contact: ""
              },
              theme: {
                  color: "#4F46E5"
              },
              modal: {
                  ondismiss: function() {
                      setBuying(false);
                  }
              }
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();

      } catch (err) {
          console.error("Purchase failed:", err);
          setError(err.message || "Failed to initiate payment. Please try again.");
          setBuying(false);
      }
  };
  
  if (loading) {
      return (
          <ProtectedLayout allowedRoles={["buyer"]}>
              <BuyerLayout>
                 <div className="flex justify-center items-center py-20">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                 </div>
              </BuyerLayout>
          </ProtectedLayout>
      );
  }

  if (error || !item) {
      return (
          <ProtectedLayout allowedRoles={["buyer"]}>
              <BuyerLayout>
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-2xl mx-auto mt-10">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading Item</h2>
                    <p className="text-slate-600 mb-6">{error || "Item not found"}</p>
                    <Link href="/dashboard/buyer" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Marketplace
                    </Link>
                </div>
              </BuyerLayout>
          </ProtectedLayout>
      );
  }

  const { title, description, price, images, category, estimatedWeight, location, status } = item;
  const isAvailable = status === 'live' || status === 'inspection_passed';

  return (
    <ProtectedLayout allowedRoles={["buyer"]}>
      <BuyerLayout>
        <div className="mb-6">
            <Link href="/dashboard/buyer" className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
            </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100">
             <div className="grid grid-cols-1 lg:grid-cols-2">
                 {/* Image Section */}
                 <div className="bg-slate-100 p-8 flex items-center justify-center min-h-[400px]">
                      {images && images.length > 0 ? (
                          <div className="w-full space-y-4">
                              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm relative">
                                  <img src={images[0]} alt={title} className="w-full h-full object-cover" />
                                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                                      <p className="text-xl font-bold text-indigo-600">${price.toLocaleString()}</p>
                                  </div>
                              </div>
                              {images.length > 1 && (
                                  <div className="grid grid-cols-4 gap-4">
                                      {images.slice(1).map((img, idx) => (
                                          <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
                                              <img src={img} alt={`${title} ${idx}`} className="w-full h-full object-cover" />
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      ) : (
                          <div className="text-slate-400 flex flex-col items-center">
                              <ShieldCheck className="h-16 w-16 mb-4 opacity-50" />
                              <p>No images provided</p>
                          </div>
                      )}
                 </div>

                 {/* Content Section */}
                 <div className="p-8 lg:p-12 flex flex-col">
                      <div className="mb-6">
                          <div className="flex flex-wrap gap-2 mb-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                  <ShieldCheck className="w-3 h-3 mr-1" />
                                  Verified Listing
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {typeof category === 'object' ? category.name : "Scrap Category"}
                              </span>
                              {location && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {location}
                                  </span>
                              )}
                          </div>
                          
                          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">{title}</h1>
                          
                          <div className="prose prose-slate text-slate-600 mb-8 max-w-none">
                              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Description</h3>
                              <p className="leading-relaxed whitespace-pre-line">{description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-slate-100 mb-8">
                               <div>
                                   <p className="text-sm font-medium text-slate-500 mb-1">Estimated Weight</p>
                                   <p className="text-lg font-bold text-slate-900">{estimatedWeight} kg</p>
                               </div>
                               <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Logistics</p>
                                   <div className="flex items-center text-slate-900 font-medium">
                                       <Truck className="h-5 w-5 mr-2 text-indigo-500" />
                                       Pickup Available
                                   </div>
                               </div>
                          </div>
                      </div>

                      <div className="mt-auto">
                          {error && (
                              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                                  <div className="flex">
                                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                      <span className="text-sm text-red-700">{error}</span>
                                  </div>
                              </div>
                          )}

                          <button
                              onClick={handleBuy}
                              disabled={buying || !isAvailable}
                              className={`w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white transition-all duration-300 hover:-translate-y-1 ${
                                  !isAvailable
                                      ? "bg-slate-400 cursor-not-allowed shadow-none"
                                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                              } ${buying ? "opacity-75 cursor-wait" : ""}`}
                          >
                              {buying ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Transaction...
                                  </>
                              ) : isAvailable ? (
                                  "Purchase Now"
                              ) : (
                                  "Item Unavailable"
                              )}
                          </button>
                          <p className="mt-4 text-center text-xs text-slate-400">
                             Secure transaction protected by Scavenger Hunt Guarantee
                          </p>
                      </div>
                 </div>
             </div>
        </div>
      </BuyerLayout>
    </ProtectedLayout>
  );
}
