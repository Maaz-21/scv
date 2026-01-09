export default function AdminListingCard({ listing, onApprove, onReject, actionLoading }) {
  const { _id, title, description, price, estimatedWeight, images, sellerId, createdAt } = listing;
  const thumbnail = images && images.length > 0 ? images[0] : null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-6">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          {thumbnail ? (
            <img className="h-48 w-full object-cover md:w-48" src={thumbnail} alt={title} />
          ) : (
            <div className="h-48 w-full bg-gray-200 md:w-48 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <div className="p-8 w-full">
          <div className="flex justify-between items-start">
             <div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{listing.category?.name || "Uncategorized"}</div>
                <h3 className="block mt-1 text-lg leading-tight font-medium text-black">{title}</h3>
                <p className="mt-2 text-gray-500">{description}</p>
             </div>
             <div className="text-right">
                 <p className="text-lg font-bold text-gray-900">${price}</p>
                 <p className="text-sm text-gray-500">{estimatedWeight} kg</p>
             </div>
          </div>
          
          <div className="mt-4 border-t border-gray-100 pt-4 flex justify-between items-center">
             <div className="text-sm text-gray-600">
                 <p>Seller: <span className="font-medium text-gray-900">{sellerId?.name || "Unknown"}</span></p>
                 <p>Email: {sellerId?.email}</p>
                 <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(createdAt).toLocaleDateString()}</p>
             </div>
             <div className="flex space-x-3">
                 <button
                    onClick={() => onReject(_id)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                 >
                     Reject
                 </button>
                 <button
                    onClick={() => onApprove(_id)}
                    disabled={actionLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                 >
                     Approve for Inspection
                 </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
