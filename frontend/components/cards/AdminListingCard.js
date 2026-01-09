import { MapPin, User, Mail, Tag, DollarSign, Scale, Calendar, Check, X, Eye } from "lucide-react";

export default function AdminListingCard({ listing, onApprove, onReject, actionLoading }) {
  const { _id, title, description, price, estimatedWeight, images, sellerId, createdAt, status, location, category } = listing;
  const thumbnail = images && images.length > 0 ? images[0] : null;

  const statusColors = {
    submitted: "text-yellow-700 bg-yellow-50 ring-yellow-600/20",
    admin_approved: "text-blue-700 bg-blue-50 ring-blue-600/20",
    inspection_passed: "text-indigo-700 bg-indigo-50 ring-indigo-600/20",
    inspection_failed: "text-red-700 bg-red-50 ring-red-600/20",
    live: "text-green-700 bg-green-50 ring-green-600/20",
    sold: "text-gray-700 bg-gray-50 ring-gray-600/20",
    rejected: "text-red-800 bg-red-50 ring-red-600/20",
  };

  const statusColor = statusColors[status] || "text-gray-600 bg-gray-50 ring-gray-500/10";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="md:flex h-full">
        {/* Thumbnail Section */}
        <div className="md:w-72 bg-gray-100 relative shrink-0">
          {thumbnail ? (
            <img className="h-full w-full object-cover absolute inset-0" src={thumbnail} alt={title} />
          ) : (
            <div className="h-48 md:h-full w-full flex flex-col items-center justify-center text-gray-400">
              <Eye className="h-10 w-10 mb-2 opacity-50" />
              <span className="text-sm font-medium">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
             <span className="inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-500/10 shadow-sm backdrop-blur-sm">
               <Tag className="w-3 h-3 mr-1 text-indigo-500" />
               {category?.name || "Uncategorized"}
             </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between w-full">
          <div>
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                     <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                     {location}
                     <span className="mx-2 text-gray-300">•</span>
                     <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                     {new Date(createdAt).toLocaleDateString()}
                  </div>
               </div>
               <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusColor}`}>
                  {status ? status.replace(/_/g, " ").toUpperCase() : "UNKNOWN"}
               </span>
            </div>
            
            <p className="mt-4 text-gray-600 text-sm line-clamp-2">{description}</p>
            
            {/* Specs Grid */}
            <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Price</p>
                        <p className="font-bold text-gray-900">${price}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <Scale className="w-4 h-4 text-blue-600 mr-2" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Weight</p>
                        <p className="font-bold text-gray-900">{estimatedWeight} kg</p>
                    </div>
                </div>
            </div>
          </div>
          
          {/* Footer Section */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                    {(sellerId?.name || "U").charAt(0).toUpperCase()}
                 </div>
                 <div className="text-sm">
                     <p className="font-medium text-gray-900 flex items-center gap-1">
                        {sellerId?.name || "Unknown"}
                     </p>
                     <p className="text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {sellerId?.email}
                     </p>
                 </div>
             </div>

             <div className="flex gap-2">
                 <button
                    onClick={() => onReject(_id)}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 border border-red-200 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                     <X className="w-4 h-4 mr-2" />
                     Reject
                 </button>
                 <button
                    onClick={() => onApprove(_id)}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                     <Check className="w-4 h-4 mr-2" />
                     Approve for Inspection
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
