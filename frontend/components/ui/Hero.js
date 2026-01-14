"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Recycle, TrendingUp, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50/40 flex flex-col justify-between min-h-[92vh]">
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-bl from-white/40 to-transparent skew-x-12 transform translate-x-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full pt-24 lg:pt-32 flex-grow flex items-center">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center w-full">
            
            {/* Left Content - 60%ish width visually via col-span-7 */}
            <div className="lg:col-span-7 relative z-10 text-center lg:text-left py-12 lg:py-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium text-sm mb-6"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                #1 Marketplace for Scrap Trading
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]"
              >
                Sell your scrap in 24h <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Instant Quotes
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 text-xl text-slate-600 font-light leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0"
              >
                Connect directly with verified industrial buyers. Turn metal, plastic, and e-waste into instant cash flow with our secure platform.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <Link
                  href="/register-seller"
                  className="group relative inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Sell Scrap Now 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-200 text-lg font-bold rounded-2xl text-slate-700 bg-white hover:border-emerald-500 hover:text-emerald-600 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Register as Buyer
                </Link>
              </motion.div>
              
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.5, delay: 0.4 }}
                 className="flex flex-wrap justify-center lg:justify-start gap-8 lg:gap-12 pt-8 border-t border-slate-200/60"
              >
                  <div className="flex flex-col">
                      <span className="text-3xl font-extrabold text-slate-900">10K+</span>
                      <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Active Listings</span>
                  </div>
                   <div className="flex flex-col">
                      <span className="text-3xl font-extrabold text-slate-900">500 Tons</span>
                      <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Recycled</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-3xl font-extrabold text-slate-900">24h</span>
                      <span className="text-sm text-slate-500 font-medium uppercase tracking-wide">Avg. Sale Time</span>
                  </div>
              </motion.div>
            </div>

            {/* Right Image/Graphic - Parallax & Stacked Feel */}
            <div className="lg:col-span-5 mt-16 lg:mt-0 relative hidden lg:block">
               <motion.div 
                 initial={{ opacity: 0, x: 50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative"
               >
                   {/* Main Image Card */}
                   <div className="relative z-20 rounded-[2.5rem] shadow-2xl bg-white p-3 rotate-3 hover:rotate-2 transition-transform duration-700">
                       <div className="aspect-[3.5/4] rounded-[2rem] overflow-hidden bg-slate-100 relative group">
                            <Image 
                               src="/hero.webp" 
                               alt="Industrial scrap pile" 
                               fill
                               className="object-cover scale-110 hover:scale-100 transition-transform duration-[1.5s]"
                               priority
                            />
                            {/* Soft Glow Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
                            
                            {/* Floating Stats Card on Image */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-100 rounded-xl">
                                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">Latest Deal</p>
                                        <p className="text-slate-900 font-bold">Steel Scrap sold for $4.2k</p>
                                    </div>
                                </div>
                            </div>
                       </div>
                   </div>
                   
                   {/* Decorative Elements */}
                   <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl -z-10 animate-pulse" />
                   <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
               </motion.div>
            </div>
            
        </div>
      </div>

      {/* Road Divider with Animated Truck */}
      <div className="relative w-full h-20 bg-gradient-to-b from-transparent to-slate-100 overflow-hidden mt-12 flex-shrink-0">
          <div className="absolute bottom-0 w-full h-12 bg-slate-200 border-t border-slate-300 flex items-center">
             {/* Road Markings */}
             <div className="w-full h-0 border-t-2 border-dashed border-slate-400/50"></div>
          </div>
          
          <motion.div
              initial={{ x: "-10vw" }}
              animate={{ x: "110vw" }}
              transition={{ 
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear"
              }}
              className="absolute bottom-3 flex flex-col items-center z-10"
          >
              <div className="relative z-10 transform -scale-x-100">
                  <Truck className="h-10 w-10 text-indigo-600 drop-shadow-md [transform:scaleX(-1)]" fill="#e0e7ff" />
              </div>
              <div className="w-12 h-1 bg-black/10 rounded-full blur-sm mt-0.5 ml-2"></div>
          </motion.div>
      </div>
    </div>
  );
}
