"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet, apiPost } from "@/services/apiClient";
import AdminListingCard from "@/components/cards/AdminListingCard";
import { Package, Inbox } from "lucide-react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import toast from "react-hot-toast";

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      const res = await apiGet("/admin/listings/pending");
      setListings(res.listings || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch pending listings", err);
      if (err.status !== 401) {
          setError("Failed to load pending listings");
      }
      setLoading(false);
    }
  };

  const openApproveModal = (id) => {
    setSelectedListingId(id);
    setApproveModalOpen(true);
  };

  const handleApprove = async () => {
    setApproveModalOpen(false);
    if (!selectedListingId) return;
    
    setActionLoading(true);
    try {
      await apiPost(`/admin/listings/${selectedListingId}/approve`, {});
      setListings((prev) => prev.filter((l) => l._id !== selectedListingId));
      toast.success("Listing approved for inspection");
    } catch (err) {
      console.error("Approve failed", err);
      toast.error("Failed to approve listing");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please enter a reason for rejection:");
    if (!reason) return;

    setActionLoading(true);
    try {
      await apiPost(`/admin/listings/${id}/reject`, { reason });
      setListings((prev) => prev.filter((l) => l._id !== id));
      toast.success("Listing rejected");
    } catch (err) {
      console.error("Reject failed", err);
      toast.error("Failed to reject listing");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Listing Review</h1>
            <p className="mt-2 text-sm text-gray-600">Review and approve listings before they are sent for inspection.</p>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
            {loading ? (
               <div className="grid grid-cols-1 gap-6">
                   {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>)}
               </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                      <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                      </div>
                  </div>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-white shadow-sm rounded-xl border border-dashed border-gray-300">
                  <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending listings</h3>
                  <p className="mt-1 text-sm text-gray-500">Good job! You're all caught up.</p>
              </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                 {listings.map((listing) => (
                   <AdminListingCard
                     key={listing._id}
                     listing={listing}
                     onApprove={openApproveModal}
                     onReject={handleReject}
                     actionLoading={actionLoading}
                   />
                 ))}
               </div>
            )}
          </div>
        </div>
        <ConfirmationModal
          isOpen={approveModalOpen}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={handleApprove}
          title="Approve Listing"
          message="Are you sure you want to approve this listing for inspection?"
          confirmText="Approve"
          cancelText="Cancel"
        />
      </AdminLayout>
    </ProtectedLayout>
  );
}