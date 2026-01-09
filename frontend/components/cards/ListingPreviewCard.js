import Link from "next/link";
import { Tag } from "lucide-react";

export default function ListingPreviewCard({ listing }) {
  const { _id, title, category, price, images } = listing;
  // Use first image or a placeholder
  const thumbnail = images && images.length > 0 ? images[0] : null;

  return (
    <Link href={`/item/${_id}`} className="group block h-full">
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-100 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
           {thumbnail ? (
             <img
               src={thumbnail}
               alt={title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             />
           ) : (
             <div className="flex items-center justify-center h-full text-slate-300 bg-slate-50">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
           )}
           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                <p className="text-sm font-bold text-indigo-600">${price.toLocaleString()}</p>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-2">
             <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                <Tag className="w-3 h-3" />
                {typeof category === 'object' ? category.name : "Scrap Item"}
             </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {title}
          </h3>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
             <span className="text-sm text-slate-400 font-medium">Verified Seller</span>
             <span className="text-sm text-indigo-600 font-medium group-hover:underline">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
