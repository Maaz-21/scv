"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-900 tracking-tight">Scavenger Hunt</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            <Link href="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              About
            </Link>
            <Link href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Contact
            </Link>
            
            {!user ? (
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
                  Login
              </Link>
            ) : (
                <>
                 <button onClick={logout} className="text-slate-500 hover:text-red-600 font-medium transition-colors">
                  Logout
                </button>
                </>
            )}
          </div>
          
           {/* Mobile menu button */}
           <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full left-0">
            <div className="px-4 pt-4 pb-6 space-y-2">
                 <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">
                    Home
                 </Link>
                 <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">
                    About
                 </Link>
                 <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50">
                    Contact
                 </Link>
                 {!user ? (
                        <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50">
                            Login
                        </Link>
                 ) : (
                    <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                        Logout
                    </button>
                 )}
            </div>
        </div>
      )}
    </nav>
  );
}
