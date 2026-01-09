import Link from "next/link";

export default function ListingCard({ listing }) {
  const { _id, title, category, price, images, estimatedWeight } = listing;
  const thumbnail = images && images.length > 0 ? images[0] : null;

  return (
    <Link href={`/item/${_id}`} className="group block h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
        <div className="relative aspect-w-16 aspect-h-9 h-48 w-full bg-gray-200">
           {thumbnail ? (
             <img
               src={thumbnail}
               alt={title}
               className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
             />
           ) : (
             <div className="flex items-center justify-center h-full text-gray-400">
               No Image
             </div>
           )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                 {typeof category === 'object' ? category.name : "Scrap"}
               </span>
               <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                 {estimatedWeight} kg
               </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-auto">{title}</h3>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
             <p className="text-xl font-bold text-gray-900">${price.toLocaleString()}</p>
             <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                 View Details &rarr;
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
