"use client";

import SellerRegisterForm from "@/components/forms/SellerRegisterForm";

export default function SellerRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as Seller
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
           Start selling your scrap materials to verified buyers.
           <br/>
           <span className="text-xs text-gray-500">Note: All seller accounts require admin approval before going live.</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SellerRegisterForm />
        </div>
      </div>
    </div>
  );
}
