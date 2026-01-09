import { Upload, ClipboardCheck, Truck, DollarSign, Search, ShoppingCart } from "lucide-react";

export default function HowItWorks() {
  const sellerSteps = [
      {
          id: 1,
          title: "Upload Item",
          desc: "Submit details and photos of your scrap materials.",
          icon: <Upload className="h-6 w-6 text-amber-600" />
      },
      {
          id: 2,
          title: "Verification",
          desc: "Our team reviews and approves your submission.",
          icon: <ClipboardCheck className="h-6 w-6 text-amber-600" />
      },
      {
          id: 3,
          title: "Get Paid",
          desc: "Once sold, receive payment securely.",
          icon: <DollarSign className="h-6 w-6 text-amber-600" />
      }
  ];

  const buyerSteps = [
      {
          id: 1,
          title: "Browse Listings",
          desc: "Find verified scrap materials in our marketplace.",
          icon: <Search className="h-6 w-6 text-emerald-600" />
      },
      {
          id: 2,
          title: "Place Order",
          desc: "Securely purchase items directly through the platform.",
          icon: <ShoppingCart className="h-6 w-6 text-emerald-600" />
      },
      {
          id: 3,
          title: "Pickup & Delivery",
          desc: "Coordinate pickup or delivery with our logistics team.",
          icon: <Truck className="h-6 w-6 text-emerald-600" />
      }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/2 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2"></div>
           <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2"></div>
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Process</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-4 text-xl text-slate-500">
            Simple, transparent, and secure process for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            {/* Seller Column */}
            <div className="relative group">
                <div className="absolute inset-0 bg-amber-50 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white border border-amber-100 rounded-3xl p-8 shadow-xl shadow-amber-100/50 h-full">
                    <div className="flex items-center gap-4 mb-8">
                         <div className="p-3 bg-amber-100 rounded-xl">
                             <DollarSign className="h-8 w-8 text-amber-600" />
                         </div>
                         <h3 className="text-2xl font-bold text-slate-800">For Sellers</h3>
                    </div>
                    
                    <div className="space-y-8">
                        {sellerSteps.map((step, idx) => (
                             <div key={idx} className="flex gap-4">
                                 <div className="flex-shrink-0">
                                     <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                                         {step.id}
                                     </div>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-semibold text-slate-900 group-hover:text-amber-700 transition-colors">{step.title}</h4>
                                     <p className="mt-1 text-slate-500 leading-relaxed">{step.desc}</p>
                                 </div>
                             </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-amber-50">
                        <p className="text-sm text-amber-600 font-medium">Start separating your scrap today.</p>
                    </div>
                </div>
            </div>

            {/* Buyer Column */}
             <div className="relative group">
                <div className="absolute inset-0 bg-emerald-50 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white border border-emerald-100 rounded-3xl p-8 shadow-xl shadow-emerald-100/50 h-full">
                    <div className="flex items-center gap-4 mb-8">
                         <div className="p-3 bg-emerald-100 rounded-xl">
                             <ShoppingCart className="h-8 w-8 text-emerald-600" />
                         </div>
                         <h3 className="text-2xl font-bold text-slate-800">For Buyers</h3>
                    </div>
                    
                    <div className="space-y-8">
                        {buyerSteps.map((step, idx) => (
                             <div key={idx} className="flex gap-4">
                                 <div className="flex-shrink-0">
                                     <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                                         {step.id}
                                     </div>
                                 </div>
                                 <div>
                                     <h4 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{step.title}</h4>
                                     <p className="mt-1 text-slate-500 leading-relaxed">{step.desc}</p>
                                 </div>
                             </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-emerald-50">
                        <p className="text-sm text-emerald-600 font-medium">Verified quality, guaranteed.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
