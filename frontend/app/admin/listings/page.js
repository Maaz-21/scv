"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import { apiGet, apiPost } from "@/services/apiClient";
import AdminListingCard from "@/components/cards/AdminListingCard";

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleApprove = async (id) => {
    if (!confirm("Are you sure you want to approve this listing for inspection?")) return;
    
    setActionLoading(true);
    try {
      await apiPost(`/admin/listings/${id}/approve`, {});
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Approve failed", err);
      alert("Failed to approve listing");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please enter a reason for rejection:");
    if (!reason) return;

    setActionLoading(true);
    try {
      await apiPost(`/admin/listings/${id}/reject`, { rejectionReason: reason });
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Reject failed", err);
      alert("Failed to reject listing");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedLayout allowedRoles={["admin"]}>
      <AdminLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Pending Listings Review</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
            {loading ? (
               <div className="flex justify-center p-10">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
               </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-10 bg-white shadow rounded-lg">
                  <p className="text-gray-500 text-lg">No pending listings to review.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {listings.map((listing) => (
                  <AdminListingCard
                    key={listing._id}
                    listing={listing}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    actionLoading={actionLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedLayout>
  );
}
