"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    switch (role) {
      case "buyer":
        return "/dashboard/buyer";
      case "seller":
        return "/dashboard/seller";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Listings", href: "/#listings" },
    { name: "About", href: "/about" }, // Assuming about page exists or just placeholder
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-xl py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                Scavenger<span className="text-indigo-600">Hunt</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative group text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 transition-all group-hover:w-full" />
              </Link>
            ))}

            {user && (
              <Link
                href={getDashboardLink()}
                className="relative group text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-full border-2 border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    Login
                  </motion.button>
                </Link>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="px-5 py-2 rounded-full border-2 border-red-600 text-red-600 font-semibold hover:bg-red-50 transition-colors cursor-pointer"
              >
                Logout
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-gray-50 shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <span className="text-xl font-bold text-slate-900">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-lg font-medium text-slate-700 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-lg font-medium text-slate-700 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
              <div className="p-6 border-t border-gray-200 bg-white space-y-3">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                        Log in
                      </button>
                    </Link>
                    <Link href="/register-seller" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-amber-500 hover:bg-amber-600">
                        Join as Seller
                      </button>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
