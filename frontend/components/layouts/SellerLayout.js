"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, PlusCircle, User, ShieldAlert } from "lucide-react";

export default function SellerLayout({ children }) {
    const { logout, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const sellerStatus = user?.status || "pending";
    const isApproved = sellerStatus === 'active' || sellerStatus === 'approved';

    const isActive = (path) => pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Professional Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        {/* Logo & Nav */}
                        <div className="flex items-center">
                            <Link href="/dashboard/seller" className="flex-shrink-0 flex items-center gap-2 group">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    S
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">Scavenger Hunt</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Seller Central</span>
                                </div>
                            </Link>

                            <div className="hidden md:ml-10 md:flex md:space-x-1">
                                <Link
                                    href="/dashboard/seller"
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive('/dashboard/seller') 
                                        ? 'text-indigo-600 bg-indigo-50' 
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>

                                <Link
                                    href="/dashboard/seller/orders"
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        isActive('/dashboard/seller/orders') 
                                        ? 'text-indigo-600 bg-indigo-50' 
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Orders
                                </Link>
                                
                                {isApproved ? (
                                    <Link
                                        href="/dashboard/seller/sell"
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            isActive('/dashboard/seller/sell') 
                                            ? 'text-indigo-600 bg-indigo-50' 
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        }`}
                                    >
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Sell Item
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-slate-300 cursor-not-allowed">
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Sell Item (Locked)
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* User Profile & Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end mr-2">
                                <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                                <span className={`text-xs font-medium flex items-center ${isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {isApproved ? (
                                        <>Verified Seller</>
                                    ) : (
                                        <>Pending Approval</>
                                    )}
                                </span>
                            </div>
                            
                            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                            <button
                                onClick={handleLogout}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Account Status Alert */}
            {!isApproved && (
                <div className="bg-amber-50 border-b border-amber-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center sm:justify-start">
                         <ShieldAlert className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
                         <p className="text-sm font-medium text-amber-800">
                            <strong>Account Under Review:</strong> Your seller account requires administrator approval before you can list items.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            
            {/* Minimal Footer for Seller Central */}
            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center text-xs text-slate-400">
                    <p>&copy; 2026 Scavenger Hunt Inc. Seller Central.</p>
                    <div className="space-x-4">
                        <a href="#" className="hover:text-slate-600">Terms</a>
                        <a href="#" className="hover:text-slate-600">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
