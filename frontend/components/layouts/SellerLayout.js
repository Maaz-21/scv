"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SellerLayout({ children }) {
    const { logout, user } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    // Safely access status, defaulting to pending if user object isn't fully loaded yet
    const sellerStatus = user?.status || "pending"; // Assuming 'status' is directly on user object from login response
    const isApproved = sellerStatus === 'active' || sellerStatus === 'approved'; // Adjust based on exact backend string 'active' based on login controller

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard/seller" className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-blue-600">Scavenger Hunt</span>
                                <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Seller</span>
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard/seller"
                                    className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                
                                {isApproved ? (
                                    <Link
                                        href="/dashboard/seller/sell"
                                        className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Sell Item
                                    </Link>
                                ) : (
                                    <span className="cursor-not-allowed border-transparent text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" title="Account approval required">
                                        Sell Item (Locked)
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className={`text-xs ${isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {isApproved ? 'Approved Seller' : 'Pending Approval'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    type="button"
                                    className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {!isApproved && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>Account Pending Approval:</strong> You cannot list items for sale until an administrator reviews and approves your seller account.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
