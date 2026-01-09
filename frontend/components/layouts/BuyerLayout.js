"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function BuyerLayout({ children }) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard/buyer" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Scavenger Hunt</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Buyer</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard/buyer"
                  className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Marketplace
                </Link>
                <Link
                  href="/dashboard/buyer/orders"
                  className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                  <span className="mr-4 text-sm text-gray-600 hidden sm:inline-block">Welcome, {user?.name}</span>
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

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
