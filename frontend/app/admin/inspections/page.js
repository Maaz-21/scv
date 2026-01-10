"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet, apiPost } from "@/services/apiClient";
import { Search, CheckCircle, XCircle, FileText, ClipboardList } from "lucide-react";

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
            <h1 className="text-3xl font-bold text-gray-900">Inspection Management</h1>
            <p className="mt-2 text-sm text-gray-600">Review items physically and mark them as Passed or Failed.</p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
            {loading ? (
               <div className="flex justify-center p-10">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
               </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white shadow-sm rounded-xl border border-dashed border-gray-300">
                  <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-lg font-medium text-gray-900">No items waiting for inspection.</p>
                  <p className="mt-1 text-sm text-gray-500">Items approved by admin will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {listings.map((listing) => (
                  <div key={listing._id} className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden border border-gray-200">
                      <div className="p-6 md:flex justify-between items-start gap-6">
                           <div className="flex-1 md:flex gap-6">
                               <div className="flex-shrink-0">
                                  {listing.images && listing.images[0] ? (
                                      <img src={listing.images[0]} alt={listing.title} className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
                                  ) : (
                                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                          <Search className="w-8 h-8" />
                                      </div>
                                  )}
                               </div>
                               <div className="flex-1 mt-4 md:mt-0">
                                  <div className="flex justify-between">
                                      <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {listing.category?.name || "Uncategorized"}
                                      </span>
                                  </div>
                                  
                                  <div className="mt-1 text-sm text-gray-500">
                                      <span className="font-medium text-gray-900">{listing.sellerId?.name}</span> ({listing.sellerId?.email})
                                  </div>
                                  <p className="mt-3 text-gray-700 leading-relaxed text-sm">{listing.description}</p>
                                  
                                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 w-full max-w-md">
                                     <div><span className="text-gray-500 font-medium">Estimated Weight:</span> <span className="text-gray-900">{listing.estimatedWeight} kg</span></div>
                                     <div><span className="text-gray-500 font-medium">Declared Price:</span> <span className="text-gray-900">${listing.price}</span></div>
                                     <div><span className="text-gray-500 font-medium">Location:</span> <span className="text-gray-900">{listing.location}</span></div>
                                     <div><span className="text-gray-500 font-medium">Listed Date:</span> <span className="text-gray-900">{new Date(listing.createdAt).toLocaleDateString()}</span></div>
                                  </div>
                               </div>
                           </div>
                           
                           <div className="mt-6 md:mt-0 md:w-80 flex-shrink-0 flex flex-col gap-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100/50">
                              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Inspection Notes
                              </h4>
                              <textarea
                                className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md p-2 bg-white"
                                rows={3}
                                placeholder="Enter details about condition, weight verification, etc..."
                                value={notes[listing._id] || ""}
                                onChange={(e) => setNotes({ ...notes, [listing._id]: e.target.value })}
                              />
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleInspection(listing._id, "failed")}
                                  disabled={actionLoading}
                                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Fail
                                </button>
                                <button
                                  onClick={() => handleInspection(listing._id, "passed")}
                                  disabled={actionLoading}
                                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Pass
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