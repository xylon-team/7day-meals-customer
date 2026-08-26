"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

const INITIAL_CART_ITEMS = [
  {
    id: 1,
    name: 'Chicken Rice & Curry',
    category: 'Lunch',
    price: 1200,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Fish Ambul Thiyal Dinner',
    category: 'Dinner',
    price: 1400,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=150&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Kottu Roti (Chicken)',
    category: 'Dinner',
    price: 1300,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=150&auto=format&fit=crop'
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal; // Assuming free delivery as per design

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Header cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} activeTab="Dashboard" />
      
      <main className="flex-grow max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h1 className="text-[32px] md:text-[40px] font-serif text-slate-900 mb-8 font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-8 bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Items ({cartItems.length})</h2>
              <button 
                onClick={clearCart}
                className="text-[#E03131] hover:text-red-700 font-semibold text-sm transition-colors"
              >
                Clear Cart
              </button>
            </div>
            
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
                  {/* Image */}
                  <div className="flex-shrink-0 w-[120px] h-[120px] relative rounded-[16px] overflow-hidden bg-gray-100 shadow-sm">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-grow flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[17px] font-bold text-gray-900 mb-1.5">{item.name}</h3>
                        <span className="inline-block px-3 py-1 bg-[#F1F3F5] text-gray-600 text-[11px] font-semibold rounded-md uppercase tracking-wide">
                          {item.category}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-full bg-white h-[38px] px-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900 text-[15px]">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* Price Details */}
                      <div className="text-right">
                        <div className="text-[13px] text-gray-500 mb-0.5">Rs. {item.price} each</div>
                        <div className="text-[19px] font-bold text-[#0B7A75]">Rs. {item.price * item.quantity}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {cartItems.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  Your cart is empty.
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-7 sticky top-24">
              <h2 className="text-[22px] font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-[15px]">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-[#2B8A3E]">Free</span>
                </div>
              </div>
              
              <div className="my-6 border-t border-gray-100"></div>
              
              <div className="flex justify-between items-start mb-6">
                <span className="text-[19px] font-bold text-gray-900 mt-1">Total</span>
                <div className="text-right">
                  <div className="text-[26px] font-bold text-[#0B7A75]">Rs. {total}</div>
                  <div className="text-[11px] font-medium text-gray-400 mt-0.5">Including all taxes</div>
                </div>
              </div>
              
              <div className="flex gap-2.5 mb-6">
                <input 
                  type="text" 
                  placeholder="Coupon code" 
                  className="flex-grow bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-[#0B7A75] focus:border-transparent transition-all placeholder:text-gray-400"
                />
                <button className="bg-[#1A1D20] text-white px-5 py-3 rounded-xl text-[14px] font-bold hover:bg-black transition-colors shadow-sm">
                  Apply
                </button>
              </div>
              
              <button className="w-full bg-[#0B7A75] hover:bg-[#09635E] text-white py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_0_rgba(11,122,117,0.39)] hover:shadow-[0_6px_20px_rgba(11,122,117,0.23)] hover:-translate-y-[1px]">
                <span className="text-[16px]">Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
