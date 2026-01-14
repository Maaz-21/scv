"use client";

import { Upload, ClipboardCheck, Truck, DollarSign, Search, ShoppingCart, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      role: "seller",
      title: "Snap & Upload",
      desc: "Take clear photos of your scrap metals or e-waste. Add weight estimates and location details in seconds.",
      icon: <Upload className="h-6 w-6 text-white" />,
      color: "bg-amber-500",
      lightColor: "bg-amber-50"
    },
    {
      id: 2,
      role: "buyer",
      title: "Browse Verified Listings",
      desc: "Filter by material type, location, and quantity. See detailed photos and verification status instantly.",
      icon: <Search className="h-6 w-6 text-white" />,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50"
    },
    {
      id: 3,
      role: "seller",
      title: "Get Verified",
      desc: "Our experts review your listing. Once approved, it goes live to thousands of industrial buyers.",
      icon: <ClipboardCheck className="h-6 w-6 text-white" />,
      color: "bg-amber-500",
      lightColor: "bg-amber-50"
    },
    {
      id: 4,
      role: "buyer",
      title: "Secure Purchase",
      desc: "Place orders securely. Funds are held in escrow until you verify the goods on pickup.",
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50"
    },
    {
      id: 5,
      role: "seller",
      title: "Get Paid",
      desc: "Coordinate pickup seamlessly. Payment is released to your account immediately after handover.",
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: "bg-amber-500",
      lightColor: "bg-amber-50"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="how-it-works">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 opacity-50"></div>
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-3xl translate-y-1/4 opacity-50"></div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-4"
          >
             <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold uppercase tracking-wider">
               Simple Process
             </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-slate-500"
          >
            A seamless ecosystem connecting scrap sellers with industrial buyers.
          </motion.p>
        </div>

        <div className="relative">
            {/* Vertical Line for Desktop */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden lg:block"></div>

            <div className="space-y-12 lg:space-y-24">
                {steps.map((step, idx) => (
                    <motion.div 
                        key={step.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={`relative flex flex-col lg:flex-row gap-8 items-center ${idx % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
                    >
                        {/* Timeline Node - Desktop */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white shadow-md z-10 hidden lg:flex items-center justify-center bg-slate-50">
                            <span className={`text-sm font-bold ${step.role === 'seller' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {step.id}
                            </span>
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 w-full lg:w-1/2">
                           <motion.div 
                              whileHover={{ y: -5 }}
                              className={`p-8 rounded-3xl bg-white border border-slate-100 shadow-xl ${
                                  step.role === 'seller' ? 'shadow-amber-100/40' : 'shadow-emerald-100/40'
                              } group`}
                           >
                               <div className="flex items-start justify-between mb-6">
                                   <div className={`p-4 rounded-2xl ${step.color} shadow-lg text-white transform group-hover:scale-110 transition-transform duration-300`}>
                                       {step.icon}
                                   </div>
                                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                       step.role === 'seller' 
                                         ? 'bg-amber-50 text-amber-700' 
                                         : 'bg-emerald-50 text-emerald-700'
                                   }`}>
                                       {step.role}
                                   </span>
                               </div>
                               
                               <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                   {step.title}
                               </h3>
                               <p className="text-slate-500 leading-relaxed text-lg">
                                   {step.desc}
                               </p>
                           </motion.div>
                        </div>

                        {/* Spacer for the other side */}
                        <div className="flex-1 hidden lg:block"></div>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
