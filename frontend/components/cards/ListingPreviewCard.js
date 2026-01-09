import Link from "next/link";
import Image from "next/image";

export default function ListingPreviewCard({ listing }) {
  const { _id, title, category, price, images } = listing;
  // Use first image or a placeholder
  const thumbnail = images && images.length > 0 ? images[0] : null;

  return (
    <Link href={`/item/${_id}`} className="group block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
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
        <div className="p-4">
           {/* Category tag could happen here if we had category name populated. 
               Assuming category is an ID or object. If object, use category.name. 
               The prompt says "category" prop. */}
          <p className="text-sm font-medium text-blue-600 mb-1">
             {typeof category === 'object' ? category.name : "Scrap Item"}
          </p>
          <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
          <p className="mt-2 text-xl font-bold text-gray-900">${price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
