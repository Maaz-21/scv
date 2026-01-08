'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/services/apiClient';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboardPage() {
    const router = useRouter();
    const { role, isAuthenticated, loading: authLoading } = useAuth();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            fetchDashboardStats();
        }
    }, [authLoading, isAuthenticated, role, router]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await apiGet('/admin/dashboard');
            setStats(response);
        } catch (err) {
            setError(err.message || 'Failed to load dashboard stats');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
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
                        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-blue-100">Marketplace overview and statistics</p>
                    </div>
                </div>

                {stats && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers || 0}
                                icon="👥"
                                gradient="from-blue-500 to-blue-600"
                            />
                            <StatCard
                                title="Total Listings"
                                value={stats.totalListings || 0}
                                icon="📦"
                                gradient="from-purple-500 to-purple-600"
                            />
                            <StatCard
                                title="Pending Listings"
                                value={stats.pendingListings || 0}
                                icon="⏳"
                                gradient="from-yellow-500 to-orange-500"
                                link="/dashboard/admin/listings/pending"
                            />
                            <StatCard
                                title="Approved Listings"
                                value={stats.approvedListings || 0}
                                icon="✅"
                                gradient="from-green-500 to-emerald-600"
                            />
                            <StatCard
                                title="Total Orders"
                                value={stats.totalOrders || 0}
                                icon="🛒"
                                gradient="from-[#FF7F32] to-[#ff9d5c]"
                                link="/dashboard/admin/orders"
                            />
                            <StatCard
                                title="Completed Orders"
                                value={stats.completedOrders || 0}
                                icon="✓"
                                gradient="from-[#0A2E52] to-[#0d3a63]"
                            />
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#FF7F32]">
                            <h2 className="text-2xl font-bold text-[#0A2E52] mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <QuickActionCard
                                    title="Pending Listings"
                                    description="Review and approve seller listings"
                                    buttonText="View Pending"
                                    onClick={() => router.push('/dashboard/admin/listings/pending')}
                                    icon="📋"
                                />
                                <QuickActionCard
                                    title="Manage Orders"
                                    description="View and update order statuses"
                                    buttonText="View Orders"
                                    onClick={() => router.push('/dashboard/admin/orders')}
                                    icon="📊"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, gradient, link }) {
    const router = useRouter();

    const cardContent = (
        <div className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
            <div className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-br ${gradient} rounded-lg p-3 shadow-md`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                    {link && (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    if (link) {
        return (
            <div
                onClick={() => router.push(link)}
                className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
                {cardContent}
            </div>
        );
    }

    return cardContent;
}

function QuickActionCard({ title, description, buttonText, onClick, icon }) {
    return (
        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md p-6 border-l-4 border-[#FF7F32] hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-start">
                <div className="bg-gradient-to-br from-[#FF7F32] to-[#ff9d5c] rounded-lg p-3 shadow-md text-white text-3xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#0A2E52] mb-2">{title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{description}</p>
                    <button
                        onClick={onClick}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#0A2E52] to-[#0d3a63] text-white rounded-lg hover:from-[#0d3a63] hover:to-[#0A2E52] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-semibold text-sm"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
