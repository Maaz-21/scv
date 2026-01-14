"use client";

import BuyerRegisterForm from "@/components/forms/BuyerRegisterForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BuyerRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center pt-32 pb-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
         <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Join as a Buyer
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
              Create an account to browse verified listings and purchase scrap materials securely.
            </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 sm:rounded-2xl sm:px-10 border border-slate-100">
          <BuyerRegisterForm />
          
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
