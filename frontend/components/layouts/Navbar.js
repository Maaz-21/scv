"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Scavenger Hunt</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            
            {!user ? (
              <>
                <Link href="/login" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Register as Buyer
                </Link>
                <Link href="/register-seller" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Register as Seller
                </Link>
              </>
            ) : (
                <>
                {/* Basic dashboard link based on role could go here, but prompt focused on public home page flow */}
                 <button onClick={logout} className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Logout
                </button>
                </>
            )}
          </div>
          
           {/* Mobile menu button */}
           <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
                 <Link href="/" className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50">
                    Home
                 </Link>
                 {!user && (
                     <>
                        <Link href="/login" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                            Login
                        </Link>
                        <Link href="/register" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                            Register as Buyer
                        </Link>
                        <Link href="/register-seller" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300">
                            Register as Seller
                        </Link>
                     </>
                 )}
            </div>
        </div>
      )}
    </nav>
  );
}
