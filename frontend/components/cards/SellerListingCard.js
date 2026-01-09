import Link from "next/link";
import { Package, Calendar, Tag, Weight, AlertCircle, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";

export default function SellerListingCard({ listing }) {
  const { title, category, price, status, images, estimatedWeight, createdAt } = listing;
  const thumbnail = images && images.length > 0 ? images[0] : null;

  const STATUS_CONFIG = {
    submitted: {
      label: "Submitted (Awaiting Review)",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock
    },
    admin_approved: {
      label: "Approved (Inspection Pending)",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: CheckCircle
    },
    inspection_passed: {
      label: "Live / Verified",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle
    },
    live: { 
        label: "Live / Verified",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle
    },
    sold: {
      label: "Sold",
      color: "bg-slate-100 text-slate-600 border-slate-200",
      icon: Package
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle
    },
    inspection_failed: {
        label: "Inspection Failed",
        color: "bg-red-50 text-red-700 border-red-200",
        icon: AlertCircle
    }
  };

  const config = STATUS_CONFIG[status] || { 
      label: status, 
      color: "bg-gray-50 text-gray-600 border-gray-200",
      icon: AlertCircle
  };
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row h-full">
        {/* Compact Thumbnail */}
        <div className="sm:w-40 w-full shrink-0 relative bg-slate-100 min-h-[160px] sm:min-h-0">
             {thumbnail ? (
                 <img src={thumbnail} alt={title} className="w-full h-full object-cover absolute inset-0" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-400">
                     <Package className="h-8 w-8 opacity-50" />
                 </div>
             )}
        </div>

        {/* Data Dense Content */}
        <div className="p-4 flex-grow flex flex-col justify-between">
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                    <h3 className="font-bold text-slate-900 line-clamp-1 text-lg">{title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${config.color} whitespace-nowrap self-start sm:self-auto`}>
                        <StatusIcon className="w-3 h-3 mr-1.5" />
                        {config.label}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600 mb-3">
                    <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="truncate max-w-[120px]" title={typeof category === 'object' ? category.name : "Category"}>
                            {typeof category === 'object' ? category.name : "Category"}
                        </span>
                    </div>
                    <div className="flex items-center font-bold text-slate-900">
                        <DollarSign className="w-4 h-4 mr-1 text-emerald-600" />
                        {price.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                        <Weight className="w-4 h-4 mr-2 text-slate-400" />
                        {estimatedWeight} kg
                    </div>
                     <div className="flex items-center text-xs text-slate-400">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {new Date(createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
            
            {/* Actions / ID */}
            <div className="pt-3 border-t border-slate-50 flex justify-between items-center mt-auto">
                 <span className="text-xs text-slate-400 font-mono tracking-wider">ID: {listing._id.slice(-6).toUpperCase()}</span>
                 <Link href={`/dashboard/seller/edit/${listing._id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hidden">
                    Edit Details
                 </Link>
            </div>
        </div>
    </div>
  );
}
