"use client";

import SellerRegisterForm from "@/components/forms/SellerRegisterForm";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function SellerRegisterPage() {
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
         <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Start Selling Today
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
              Join our network of verified sellers and reach buyers looking for quality scrap materials.
            </p>
         </div>
         
         <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 mb-8 mx-4 sm:mx-0">
            <div className="flex">
                <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">Verification Required</h3>
                    <div className="mt-2 text-sm text-amber-700">
                        <p>All seller accounts require admin approval and on-site verification before listings go live.</p>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-2xl sm:px-10 border border-slate-100">
          <SellerRegisterForm />
          
           <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                      Sign in
                  </Link>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
}
