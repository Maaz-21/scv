'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/services/apiClient';
import { useAuth } from '@/hooks/useAuth';

export default function PendingListingsPage() {
    const router = useRouter();
    const { role, isAuthenticated, loading: authLoading } = useAuth();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }
            if (role !== 'admin') {
                router.push('/');
                return;
            }
            fetchPendingListings();
        }
    }, [authLoading, isAuthenticated, role, router]);

    const fetchPendingListings = async () => {
        try {
            setLoading(true);
            const response = await apiGet('/admin/listings/pending');
            const listingsData = response.listings || response.data || [];
            setListings(Array.isArray(listingsData) ? listingsData : []);
        } catch (err) {
            setError(err.message || 'Failed to load pending listings');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (listingId) => {
        if (!confirm('Are you sure you want to approve this listing?')) return;

        try {
            setActionLoading(true);
            await apiPost(`/admin/listings/${listingId}/approve`, {});
            setListings(listings.filter(l => l._id !== listingId));
            alert('Listing approved successfully!');
        } catch (err) {
            alert(err.message || 'Failed to approve listing');
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            setActionLoading(true);
            await apiPost(`/admin/listings/${selectedListing._id}/reject`, {
                reason: rejectionReason
            });
            setListings(listings.filter(l => l._id !== selectedListing._id));
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedListing(null);
            alert('Listing rejected successfully!');
        } catch (err) {
            alert(err.message || 'Failed to reject listing');
        } finally {
            setActionLoading(false);
        }
    };

    const openRejectModal = (listing) => {
        setSelectedListing(listing);
        setShowRejectModal(true);
    };

    const closeRejectModal = () => {
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedListing(null);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F32]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-[#0A2E52] to-[#0d3a63] rounded-2xl shadow-xl p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Pending Listings</h1>
                                <p className="text-blue-100">Review and approve seller listings</p>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard/admin')}
                                className="px-6 py-3 bg-white text-[#0A2E52] rounded-lg hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                {listings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-t-4 border-yellow-500">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-gray-500 text-xl font-semibold">No pending listings</p>
                        <p className="text-gray-400 text-sm mt-2">All listings have been reviewed</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {listings.map((listing) => (
                            <ListingCard
                                key={listing._id}
                                listing={listing}
                                onApprove={handleApprove}
                                onReject={openRejectModal}
                                actionLoading={actionLoading}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showRejectModal && (
                <RejectModal
                    listing={selectedListing}
                    reason={rejectionReason}
                    setReason={setRejectionReason}
                    onConfirm={handleReject}
                    onCancel={closeRejectModal}
                    loading={actionLoading}
                />
            )}
        </div>
    );
}

function ListingCard({ listing, onApprove, onReject, actionLoading }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-l-4 border-yellow-500 hover:shadow-2xl transition-shadow duration-300">
            <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[#0A2E52] mb-2">{listing.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 text-[#FF7F32]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                </svg>
                                {typeof listing.sellerId === 'object' ? listing.sellerId?.name : listing.sellerId || 'Unknown'}
                            </span>
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1 text-[#FF7F32]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                                </svg>
                                {typeof listing.category === 'object' ? listing.category?.name : listing.category || 'N/A'}
                            </span>
                        </div>
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-sm font-bold rounded-full shadow-md">
                        PENDING
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Price</p>
                        <p className="text-xl font-bold text-[#FF7F32]">₹{listing.price}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Weight</p>
                        <p className="text-xl font-bold text-[#0A2E52]">{listing.estimatedWeight} kg</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Location</p>
                        <p className="text-sm font-semibold text-gray-900">{listing.location}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Created</p>
                        <p className="text-sm font-semibold text-gray-900">{new Date(listing.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                    <p className="text-gray-900">{listing.description}</p>
                </div>

                {listing.images && listing.images.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Images ({listing.images.length})</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {listing.images.slice(0, 4).map((image, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000${image}`}
                                    alt={`Listing ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg shadow-md border-2 border-gray-200 hover:border-[#FF7F32] transition-colors duration-200"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={() => onApprove(listing._id)}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        ✓ Approve Listing
                    </button>
                    <button
                        onClick={() => onReject(listing)}
                        disabled={actionLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        ✕ Reject Listing
                    </button>
                </div>
            </div>
        </div>
    );
}

function RejectModal({ listing, reason, setReason, onConfirm, onCancel, loading }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Reject Listing: {listing?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Please provide a reason for rejecting this listing:
                    </p>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150 disabled:opacity-50"
                        >
                            {loading ? 'Rejecting...' : 'Reject'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
