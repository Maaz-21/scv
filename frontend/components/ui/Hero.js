import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Turn your scrap into</span>{" "}
                <span className="block text-blue-600 xl:inline">cash or treasure</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Scavenger Hunt is the premier marketplace for buying and selling verified scrap materials. 
                Sellers get fair value, and buyers get quality-checked goods.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/register-seller"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Register as Seller
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                  >
                    Register as Buyer
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Decorative image placeholder */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-100 flex items-center justify-center">
         <div className="text-gray-400 font-bold text-xl">[Hero Image Placeholder]</div>
         {/* In a real app, use <Image /> here */}
      </div>
    </div>
  );
}
