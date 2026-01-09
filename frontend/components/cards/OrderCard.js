export default function OrderCard({ order }) {
  const { _id, listing, amount, status, pickupDate, createdAt } = order;
  
  // formatting
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const formattedPickup = pickupDate ? new Date(pickupDate).toLocaleDateString() : 'Pending';
  
  // Status badge styling
  const getStatusColor = (statusState) => {
    switch (statusState) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'pickup_scheduled': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-yellow-100 text-yellow-800'; // initiated/pending
    }
  };

  const humanStatus = (statusState) => {
      switch (statusState) {
          case 'pickup_scheduled': return 'Pickup Scheduled';
          default: return statusState.charAt(0).toUpperCase() + statusState.slice(1);
      }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
             <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                 <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                 </svg>
             </div>
             <div>
                 <h4 className="text-sm font-bold text-gray-900">Order #{_id.slice(-6).toUpperCase()}</h4>
                 <p className="text-xs text-gray-500">Placed on {formattedDate}</p>
             </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
             {humanStatus(status)}
          </span>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{listing ? listing.title : "Unknown Item"}</h3>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-bold text-gray-900">${amount.toLocaleString()}</span>
            </div>
            {pickupDate && (
                <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-500">Pickup Date:</span>
                    <span className="font-medium text-gray-900">{formattedPickup}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
