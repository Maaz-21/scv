'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-[#0A2E52] via-[#0d3a66] to-[#0A2E52] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/dashboard/admin" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="bg-[#FF7F32] p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/admin/listings/pending"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              Pending Listings
            </Link>
            <Link
              href="/dashboard/admin/orders"
              className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
            >
              Orders
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7F32] to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name || 'Admin'}</p>
                <p className="text-xs text-blue-200">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-[#FF7F32] via-orange-500 to-[#FF7F32]"></div>
    </nav>
  );
}
