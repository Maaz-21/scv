import { Package, Truck, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function OrderCard({ order }) {
  const { _id, listingId, amount, status, pickupDate, createdAt } = order;
  const listing = listingId;
  
  // formatting
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const formattedPickup = pickupDate ? new Date(pickupDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'}) : 'Scheduling...';
  
  // Determine Status Config
  const getStatusConfig = (statusState) => {
    switch (statusState) {
        case 'completed': 
            return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle, label: 'Completed' };
        case 'picked':
            return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Truck, label: 'Picked Up' };
        case 'pickup_scheduled': 
            return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Truck, label: 'Pickup Scheduled' };
        case 'confirmed':
            return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle, label: 'Confirmed' };
        case 'cancelled': 
            return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, label: 'Cancelled' };
        case 'initiated':
        default: 
            return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock, label: 'Processing' };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  // Image Helper
  const thumbnail = listing?.images?.[0] || null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Header / Image Area */}
      <div className="relative h-32 bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
          {thumbnail ? (
               <img src={thumbnail} alt="Item" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
          ) : (
               <Package className="h-10 w-10 text-slate-300" />
          )}
          <div className="absolute top-3 right-3">
               <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.color} shadow-sm backdrop-blur-sm`}>
                   <StatusIcon className="w-3 h-3" />
                   {statusConfig.label}
               </span>
          </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
             <div className="flex justify-between items-start mb-1">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order #{_id.slice(-6).toUpperCase()}</p>
                 <p className="text-xs text-slate-500">{formattedDate}</p>
             </div>
             <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{listing ? listing.title : "Unknown Item"}</h3>
        </div>
        
        <div className="space-y-3 pt-4 border-t border-slate-50">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Total Paid</span>
                <span className="font-bold text-slate-900 text-base">${amount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                    <Truck className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">Pickup</span>
                </div>
                <span className="font-bold text-slate-800">{formattedPickup}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
