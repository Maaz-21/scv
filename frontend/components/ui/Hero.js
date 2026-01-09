import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 text-center lg:text-left z-10">
              <h1 className="text-5xl tracking-tight font-extrabold text-slate-900 sm:text-6xl md:text-7xl mb-8 leading-tight">
                Turn Scrap Into <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Value</span>
              </h1>
              <p className="mt-4 text-xl text-slate-600 font-light leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0">
                Scavenger Hunt is the premier marketplace for verified scrap materials. 
                Sellers get fair value, and buyers get quality-checked goods through our trusted platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register-seller"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-1"
                >
                  Register as Seller
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 border border-indigo-100 text-lg font-medium rounded-2xl text-indigo-700 bg-white hover:bg-indigo-50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Register as Buyer
                </Link>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm text-slate-500">
                  <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                      Verified Listings
                  </div>
                   <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                      Secure Payments
                  </div>
              </div>
            </div>

            {/* Right Image/Graphic */}
            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
               <div className="relative rounded-3xl shadow-2xl bg-white p-4 rotate-2 hover:rotate-0 transition-transform duration-500">
                   <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative group">
                        <Image 
                           src="/hero.webp" 
                           alt="Recycling scrap metal into value" 
                           fill
                           className="object-cover hover:scale-105 transition-transform duration-700"
                           priority
                        />
                   </div>
               </div>
               
               {/* Background Blurs */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
                   <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300/30 rounded-full blur-[100px]"></div>
                   <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-300/20 rounded-full blur-[80px]"></div>
               </div>
            </div>
            
        </div>
      </div>
    </div>
  );
}
