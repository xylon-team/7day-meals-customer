'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#072F2B] text-white pt-16 pb-8 border-t border-teal-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Columns Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-teal-800/20">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0E5A52] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                7D
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                7Day Meals
              </span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed pr-4">
              Authentic Sri Lankan Flavors, Every Day. Weekly meal plans delivered to your door.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/about#services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li>
                <Link href="/meal-plans" className="hover:text-white transition-colors">Meal Plans</Link>
              </li>
              <li>
                <Link href="/about#contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-4">Customer</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Register</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">My Orders</Link>
              </li>
              <li>
                <Link href="/subscription" className="hover:text-white transition-colors">My Subscription</Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors">Help</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div id="contact">
            <h4 className="font-serif text-lg font-bold text-white mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>123 Galle Road,<br />Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>hello@7daymeals.lk</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+94 77 123 4567 (WhatsApp)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© 2026 7Day Meals. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
