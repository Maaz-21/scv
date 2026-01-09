export default function SellerListingCard({ listing }) {
  const { title, category, price, status, images, estimatedWeight } = listing;
  const thumbnail = images && images.length > 0 ? images[0] : null;

  const getStatusBadge = (statusState) => {
    switch (statusState) {
        case 'submitted':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Submitted</span>;
        case 'admin_approved':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Admin Approved</span>;
        case 'inspection_passed':
        case 'live':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Live / Verified</span>;
        case 'rejected':
        case 'inspection_failed':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected / Failed</span>;
        case 'sold':
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Sold</span>;
        default:
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{statusState}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
       <div className="flex flex-col sm:flex-row">
            <div className="sm:w-48 h-48 bg-gray-200 relative">
                {thumbnail ? (
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                )}
                <div className="absolute top-2 left-2">
                    {getStatusBadge(status)}
                </div>
            </div>
            
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                     <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                        <p className="text-lg font-bold text-blue-600">${price.toLocaleString()}</p>
                     </div>
                     <p className="text-sm text-gray-500 mb-2">
                        Category: <span className="font-medium text-gray-700">{typeof category === 'object' ? category.name : "Other"}</span>
                     </p>
                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {listing.description || "No description provided."}
                     </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                     <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                        {estimatedWeight} kg
                     </span>
                     <span>
                        Created: {new Date(listing.createdAt || Date.now()).toLocaleDateString()}
                     </span>
                </div>
            </div>
       </div>
    </div>
  );
}
