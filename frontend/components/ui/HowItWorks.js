export default function HowItWorks() {
  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Simple, transparent, and secure process for everyone.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Selling Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                For Sellers
              </h3>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Upload Item</h4>
                    <p className="mt-1 text-gray-500">
                      Submit details and photos of your scrap materials.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Admin Approval</h4>
                    <p className="mt-1 text-gray-500">
                      Our team reviews your submission for completeness.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">On-site Inspection</h4>
                    <p className="mt-1 text-gray-500">
                      We verify the quality and weight of your materials.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      4
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Go Live</h4>
                    <p className="mt-1 text-gray-500">
                      Your approved item is listed for buyers to purchase.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Buying Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-green-600 mb-6 text-center">
                For Buyers
              </h3>
              <ul className="space-y-6">
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-bold">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Browse Listings</h4>
                    <p className="mt-1 text-gray-500">
                      Find verified scrap materials in our marketplace.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-bold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Place Order</h4>
                    <p className="mt-1 text-gray-500">
                      Securely purchase items directly through the platform.
                    </p>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Pickup & Delivery</h4>
                    <p className="mt-1 text-gray-500">
                      Coordinate pickup or delivery with our logistics team.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
