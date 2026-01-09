"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet, apiPost } from "@/services/apiClient";

export default function InspectionsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const data = await apiGet("/admin/listings/inspections");
      setListings(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch inspections", err);
      setLoading(false);
    }
  };

  const handleInspection = async (id, result) => {
    if (!confirm(`Mark this item as ${result.toUpperCase()}?`)) return;

    setActionLoading(true);
    try {
      await apiPost(`/admin/listings/${id}/inspection`, {
        result,
        notes: notes[id] || ""
      });
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Inspection update failed", err);
      alert("Failed to update inspection status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Inspection Management</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
            {loading ? (
               <div className="flex justify-center p-10">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
               </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-10 bg-white shadow rounded-lg">
                  <p className="text-gray-500 text-lg">No items waiting for inspection.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {listings.map((listing) => (
                  <div key={listing._id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                      <div className="p-6 md:flex justify-between items-start gap-6">
                           <div className="flex-1">
                               <div className="flex items-center gap-4 mb-4">
                                  {listing.images && listing.images[0] && (
                                      <img src={listing.images[0]} alt={listing.title} className="w-24 h-24 object-cover rounded-md" />
                                  )}
                                  <div>
                                      <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                                      <p className="text-sm text-gray-500">Seller: {listing.sellerId?.name} ({listing.sellerId?.email})</p>
                                      <p className="text-sm text-gray-500">Listed: {new Date(listing.createdAt).toLocaleDateString()}</p>
                                  </div>
                               </div>
                               <p className="text-gray-700 mb-4">{listing.description}</p>
                               <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                   <div>Price: <span className="font-semibold text-gray-900">${listing.price}</span></div>
                                   <div>Weight: <span className="font-semibold text-gray-900">{listing.estimatedWeight} kg</span></div>
                                   <div>Location: <span className="font-semibold text-gray-900">{listing.location}</span></div>
                                   <div>Category: <span className="font-semibold text-gray-900">{listing.category?.name}</span></div>
                               </div>
                           </div>
                           <div className="w-full md:w-1/3 mt-6 md:mt-0 flex flex-col gap-3">
                              <textarea 
                                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                                  rows="3"
                                  placeholder="Inspection notes (optional)..."
                                  value={notes[listing._id] || ""}
                                  onChange={(e) => setNotes({ ...notes, [listing._id]: e.target.value })}
                              ></textarea>
                              <div className="grid grid-cols-2 gap-3">
                                  <button
                                      onClick={() => handleInspection(listing._id, "failed")}
                                      disabled={actionLoading}
                                      className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                  >
                                      Failed
                                  </button>
                                <button
                                    onClick={() => handleInspection(listing._id, "passed")}
                                    disabled={actionLoading}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                    Passed
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
    </ProtectedLayout>
  );
}
