"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  Search, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X
} from "lucide-react";

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
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Sellers Review", href: "/admin/sellers", icon: Users },
    { name: "Listings Review", href: "/admin/listings", icon: ClipboardCheck },
    { name: "Inspections", href: "/admin/inspections", icon: Search },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${isSidebarOpen ? "" : "pointer-events-none"}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${isSidebarOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 transition ease-in-out duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <span className="text-white text-xl font-bold tracking-wider">SCAVENGER HUNT</span>
            </div>
            <nav className="mt-8 px-2 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-150
                    ${pathname === item.href ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                >
                  <item.icon className={`mr-4 h-5 w-5 ${pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
            <button onClick={handleLogout} className="flex-shrink-0 group w-full flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                <LogOut className="mr-4 h-5 w-5 text-slate-400 group-hover:text-white" />
                <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-slate-900 shadow-xl z-10">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6 mb-4">
                <span className="text-white text-xl font-bold tracking-wider">SCAVENGER HUNT</span>
              </div>
              <nav className="mt-5 flex-1 px-3 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150
                      ${pathname === item.href ? "bg-blue-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
             <div className="flex-shrink-0 flex border-t border-slate-800 p-4">
                 <button onClick={handleLogout} className="flex-shrink-0 w-full flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                     <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
                     <span className="text-sm font-medium">Log out</span>
                 </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center bg-white shadow-sm h-16">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-bold text-gray-900 ml-2 text-lg">Admin Panel</span>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
