'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';
import { apiSubmitInquiry } from '@/lib/api/inquiries';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await apiSubmitInquiry({
        title: `${formData.subject} - ${formData.name}${formData.phone ? ` (${formData.phone})` : ''}`,
        sender_email: formData.email,
        message: formData.message,
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6]">
      <PublicHeader activePage="contact" />
      
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have a question about our meal plans or need help with an order?
              We're here to help!
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 mb-16">
            {/* Left: Contact Info */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#0D5C53]/10 rounded-full flex items-center justify-center text-[#0D5C53] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    123 Galle Road,
                    <br />
                    Colombo 03, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#0D5C53]/10 rounded-full flex items-center justify-center text-[#0D5C53] shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    +94 11 234 5678
                  </p>
                  <p className="text-xs text-gray-500">Mon-Sun, 8am - 8pm</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#0D5C53]/10 rounded-full flex items-center justify-center text-[#0D5C53] shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600 text-sm">hello@7daymeals.lk</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/60 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366] shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                  <p className="text-gray-600 text-sm mb-1">
                    +94 77 123 4567
                  </p>
                  <p className="text-xs text-gray-500">Fastest response time</p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-stone-200/60">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                  Send us a message
                </h2>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                    <p className="text-sm">
                      Thank you for reaching out. We'll get back to you within 24
                      hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#F9F8F6] border border-stone-200/60 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D5C53] transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#F9F8F6] border border-stone-200/60 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D5C53] transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-[#F9F8F6] border border-stone-200/60 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D5C53] transition-all"
                          placeholder="+94 77 000 0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-[#F9F8F6] border border-stone-200/60 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D5C53] transition-all appearance-none"
                        >
                          <option>General Inquiry</option>
                          <option>Meal Plans</option>
                          <option>Delivery Issue</option>
                          <option>Feedback</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-[#F9F8F6] border border-stone-200/60 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D5C53] transition-all resize-none"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#0D5C53] text-white font-bold text-lg py-4 rounded-full hover:bg-[#09433D] transition-colors shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Google Maps Integration */}
          <div className="w-full h-[400px] bg-stone-100 rounded-2xl border border-stone-200/60 overflow-hidden relative shadow-inner">
            <iframe
              title="7Day Meals Location"
              src="https://maps.google.com/maps?q=123%20Galle%20Road,%20Colombo%2003,%20Sri%20Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
