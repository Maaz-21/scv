"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Tag, ArrowRight } from "lucide-react";

export default function ListingCard({ listing }) {
  const { user, role } = useAuth();
  const { _id, title, category, price, images, estimatedWeight } = listing;
  const thumbnail = images && images.length > 0 ? images[0] : null;

  // Conditional Logic for Destination
  // If buyer -> /dashboard/buyer/item/[id]
  // Else (public/seller/admin) -> /item/[id] (Public Preview)
  const detailLink = (user && role === "buyer") 
      ? `/dashboard/buyer/item/${_id}`
      : `/item/${_id}`;

  return (
    <Link href={detailLink} className="group block h-full">
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
           {thumbnail ? (
             <img
               src={thumbnail}
               alt={title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             />
           ) : (
             <div className="flex items-center justify-center h-full text-slate-300 bg-slate-50">
               <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
           )}
           
           {/* Category Badge Overlay */}
           <div className="absolute top-3 left-3">
               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-700 shadow-sm">
                   <Tag className="w-3 h-3 text-indigo-500" />
                   {(category && typeof category === 'object') ? category.name : "Scrap"}
               </span>
           </div>

           {/* Price Tag Overlay */}
           <div className="absolute bottom-3 right-3">
                <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                    ${price.toLocaleString()}
                </span>
           </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-2">
               <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                 Verified Weight: <span className="text-slate-900 font-semibold">{estimatedWeight} kg</span>
               </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
              {title}
          </h3>
          
          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
             <span className="text-sm font-medium text-slate-400">Verified Seller</span>
             <span className="flex items-center text-sm font-bold text-indigo-600 group-hover:underline">
                 View Details <ArrowRight className="ml-1 w-4 h-4" />
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
