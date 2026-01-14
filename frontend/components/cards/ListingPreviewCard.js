import Link from "next/link";
import { Tag, Weight, MapPin, ArrowUpRight } from "lucide-react";

export default function ListingPreviewCard({ listing, isLarge = false }) {
  const { _id, title, category, price, images, location, estimatedWeight } = listing;
  // Use first image or a placeholder
  const thumbnail = images && images.length > 0 ? images[0] : null;

  return (
    <Link href={`/item/${_id}`} className="block h-full relative">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col group relative border border-slate-100`}>
        
        {/* Image Container - Heroic Crop */}
        <div className={`relative overflow-hidden bg-slate-100 ${isLarge ? 'h-2/3' : 'h-1/2 min-h-[200px]'}`}>
           {thumbnail ? (
             <img
               src={thumbnail}
               alt={title}
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
             />
           ) : (
             <div className="flex items-center justify-center h-full text-slate-300 bg-slate-50">
                <Tag className="w-12 h-12 opacity-20" />
             </div>
           )}
           
           {/* Badges Overlay */}
           <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-emerald-600 shadow-sm">
                    Verified
                </span>
                {estimatedWeight && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
                        <Weight className="w-3 h-3 mr-1" />
                        {estimatedWeight} kg
                    </span>
                )}
           </div>

           <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-orange-500/30 transform group-hover:scale-105 transition-transform">
                <p className="text-sm font-bold">₹{price?.toLocaleString()}</p>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col relative">
             <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                    {typeof category === 'object' ? category.name : "Scrap"}
                </span>
                {location && (
                    <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-0.5" /> {location}
                    </span>
                )}
             </div>

             <h3 className={`font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors ${
                 isLarge ? 'text-3xl' : 'text-xl'
             }`}>
                 {title}
             </h3>

             <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                 <span className="text-sm font-semibold text-slate-400 group-hover:text-indigo-500 transition-colors">
                     View Details
                 </span>
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                     <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                 </div>
             </div>
        </div>
      </div>
    </Link>
  );
}
   
