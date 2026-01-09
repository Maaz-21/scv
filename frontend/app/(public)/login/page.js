"use client";

import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
            Sign in to access your dashboard and manage your orders.
            </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-2xl sm:px-10 border border-slate-100">
          <LoginForm />
          
          <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                      Register as Buyer
                  </Link>
                   {' '}or{' '}
                  <Link href="/register-seller" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
                      Seller
                  </Link>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
