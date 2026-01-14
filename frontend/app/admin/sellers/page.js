"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { apiGet, apiPost } from "@/services/apiClient";
import { Check, X, User, Shield, Info } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const data = await apiGet("/admin/sellers/pending");
      // The API returns { count, sellers: [] }
      setSellers(data.sellers || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiPost(`/admin/seller/${id}/approve`, {});
      setSellers(sellers.filter((s) => s._id !== id));
      toast.success("Seller account approved");
    } catch (err) {
      toast.error("Failed to approve: " + err.message);
    }
  };

  const openRejectModal = (id) => {
    setSelectedSellerId(id);
    setRejectModalOpen(true);
  };

  const handleReject = async () => {
    setRejectModalOpen(false);
    if (!selectedSellerId) return;

    try {
      await apiPost(`/admin/seller/${selectedSellerId}/reject`, {});
      setSellers(sellers.filter((s) => s._id !== selectedSellerId));
      toast.success("Seller account rejected");
    } catch (err) {
      toast.error("Failed to reject: " + err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Approvals</h1>
          <p className="mt-2 text-sm text-gray-600">Review and verify new seller account requests.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          {loading ? (
             <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>)}
             </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
               <div className="flex">
                  <div className="flex-shrink-0">
                     <X className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                     <h3 className="text-sm font-medium text-red-800">Error loading sellers</h3>
                     <div className="mt-2 text-sm text-red-700"><p>{error}</p></div>
                  </div>
               </div>
            </div>
          ) : sellers.length === 0 ? (
            <div className="text-center py-16 bg-white shadow-sm rounded-xl border border-dashed border-gray-300">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                <p className="mt-1 text-sm text-gray-500">All seller requests have been processed.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {sellers.map((seller) => (
                  <li key={seller._id} className="hover:bg-gray-50 transition-colors">
                    <div className="px-6 py-6 sm:flex sm:items-center sm:justify-between">
                      <div className="sm:flex sm:items-start sm:gap-6 flex-1">
                        <div className="hidden sm:block">
                           <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                             {(seller.name || "U").charAt(0).toUpperCase()}
                           </div>
                        </div>
                        <div className="text-left mt-2 sm:mt-0">
                           <div className="flex items-center gap-2">
                             <h3 className="text-lg font-medium text-indigo-600 truncate">{seller.name}</h3>
                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase tracking-wide">
                               {seller.status}
                             </span>
                           </div>
                           <p className="text-sm text-gray-600 font-medium mt-1">{seller.companyName}</p>
                           <p className="text-sm text-gray-500">{seller.email}</p>
                           <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                              <span>Role: {seller.role}</span>
                              <span>•</span>
                              <span>Registered: {new Date(seller.createdAt).toLocaleDateString()}</span>
                           </div>
                           {seller.kycDocs && seller.kycDocs.length > 0 && (
                               <div className="mt-3">
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents:</span>
                                  <div className="flex gap-2 mt-1">
                                      {seller.kycDocs.map((doc, idx) => (
                                          <a key={idx} href={doc} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                                              Doc {idx + 1}
                                          </a>
                                      ))}
                                  </div>
                               </div>
                           )}
                        </div>
                      </div>
                      
                      <div className="mt-5 sm:mt-0 sm:flex-shrink-0 sm:ml-6 flex items-center gap-3">
                        <button
                          onClick={() => openRejectModal(seller._id)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(seller._id)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
        title="Reject Seller Account"
        message="Are you sure you want to reject this seller account? This action cannot be undone."
        confirmText="Yes, Reject"
        cancelText="Cancel"
        isDangerous={true}
      />
    </AdminLayout>
  );
}                        