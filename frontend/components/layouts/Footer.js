import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-2">Scavenger Hunt</h3>
            <p className="text-gray-400 max-w-xs">
              The trusted marketplace for buying and selling verified scrap materials. 
              Connecting sellers with buyers efficiently.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Platform
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="/login" className="text-base text-gray-400 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-base text-gray-400 hover:text-white">
                    Register as Buyer
                  </Link>
                </li>
                <li>
                  <Link href="/register-seller" className="text-base text-gray-400 hover:text-white">
                    Register as Seller
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link href="#" className="text-base text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-base text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Scavenger Hunt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
