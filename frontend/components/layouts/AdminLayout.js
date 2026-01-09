"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, role, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== "admin") {
        router.push("/"); // Redirect non-admins to home
      }
    }
  }, [user, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return null; // Redirecting...
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "ChartBarIcon" },
    { name: "Listings Review", href: "/admin/listings", icon: "ClipboardCheckIcon" },
    { name: "Inspections", href: "/admin/inspections", icon: "SearchCircleIcon" },
    { name: "Orders", href: "/admin/orders", icon: "ShoppingBagIcon" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${isSidebarOpen ? "" : "pointer-events-none"}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${isSidebarOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-blue-900 transition ease-in-out duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-white text-2xl font-bold">Admin Panel</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-blue-800 ${pathname === item.href ? "bg-blue-800" : ""}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
            <button onClick={handleLogout} className="flex-shrink-0 group block w-full text-left text-white">
                <div className="flex items-center">
                    <div className="ml-3">
                        <p className="text-sm font-medium">Log out</p>
                    </div>
                </div>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-blue-900">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-white text-2xl font-bold">Scavenger Hunt</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-blue-800 ${pathname === item.href ? "bg-blue-800" : ""}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
             <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
                 <button onClick={handleLogout} className="flex-shrink-0 width-full flex items-center text-white hover:text-gray-200">
                     <svg className="mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                     </svg>
                     Log out
                 </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
