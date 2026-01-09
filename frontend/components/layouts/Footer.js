import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-tight">Scavenger Hunt</h3>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              The premier marketplace for verified scrap materials. We connect sellers with buyers, ensuring quality, transparency, and fair value in every transaction.
            </p>
            <div className="flex space-x-4">
               {/* Social placeholders */}
               <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
               </Link>
               <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
               </Link>
               <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
               </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Platform</h3>
            <ul className="space-y-4">
               <li>
                  <Link href="/login" className="text-base hover:text-indigo-400 transition-colors">Login</Link>
               </li>
               <li>
                  <Link href="/register" className="text-base hover:text-indigo-400 transition-colors">Register as Buyer</Link>
               </li>
               <li>
                  <Link href="/register-seller" className="text-base hover:text-indigo-400 transition-colors">Register as Seller</Link>
               </li>
               <li>
                  <Link href="#" className="text-base hover:text-indigo-400 transition-colors">How it Works</Link>
               </li>
            </ul>
          </div>
          
          {/* Support/Legal */}
           <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Support</h3>
            <ul className="space-y-4">
               <li>
                  <Link href="#" className="text-base hover:text-indigo-400 transition-colors">Help Center</Link>
               </li>
               <li>
                  <Link href="#" className="text-base hover:text-indigo-400 transition-colors">Privacy Policy</Link>
               </li>
               <li>
                  <Link href="#" className="text-base hover:text-indigo-400 transition-colors">Terms of Service</Link>
               </li>
               <li>
                  <Link href="#" className="text-base hover:text-indigo-400 transition-colors">Contact Us</Link>
               </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6">Contact</h3>
              <ul className="space-y-4">
                  <li className="flex items-start">
                      <MapPin className="h-6 w-6 text-indigo-500 mr-3 shrink-0" />
                      <span className="text-sm">123 Marketplace Ave,<br/>Suite 100, Tech City</span>
                  </li>
                  <li className="flex items-center">
                      <Phone className="h-5 w-5 text-indigo-500 mr-3 shrink-0" />
                      <span className="text-sm">+1 (555) 123-4567</span>
                  </li>
                  <li className="flex items-center">
                      <Mail className="h-5 w-5 text-indigo-500 mr-3 shrink-0" />
                      <span className="text-sm">support@scavengerhunt.com</span>
                  </li>
              </ul>
          </div>
          
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-sm text-slate-500">
               &copy; {new Date().getFullYear()} Scavenger Hunt. All rights reserved.
           </p>
           <div className="flex space-x-6 text-sm text-slate-500">
               <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
               <Link href="#" className="hover:text-white transition-colors">Terms</Link>
               <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
