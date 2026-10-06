'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';
import { Check, ArrowRight, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { MealPlan } from '@/lib/data/meal-plans';
import { fetchMealPlans, mapApiMealToMealPlan } from '@/lib/api/meals';
import { MealCard } from '@/components/meal-plans/MealCard';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, addToCart } = useStore();
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'warning'>('success');
  const [featuredMeals, setFeaturedMeals] = useState<MealPlan[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Approximates card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchMealPlans()
      .then(raw => {
        const mapped = raw.map(mapApiMealToMealPlan);
        setFeaturedMeals(mapped.slice(0, 8)); // Display up to 8 meals in carousel
        setLoadingMeals(false);
      })
      .catch(err => {
        console.error('Failed to load featured meals', err);
        setLoadingMeals(false);
      });
  }, []);

  const handleAddToCart = (meal: MealPlan) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const success = addToCart(meal);

    if (!success) {
      setToastMessage("You can only order one meal plan at a time.");
      setToastType('warning');
    } else {
      setToastMessage(`"${meal.title}" added to cart!`);
      setToastType('success');
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleFavorite = (mealId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [mealId]: !prev[mealId],
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up ${
          toastType === 'warning' ? 'bg-red-500 text-white' : 'bg-[#0D5C53] text-white'
        }`}>
          {toastType === 'warning' ? <AlertTriangle className="w-5 h-5 text-red-100" /> : <ShoppingBag className="w-5 h-5 text-emerald-300" />}
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      {mounted && isAuthenticated ? (
        <Header activeTab="Home" />
      ) : (
        <PublicHeader activePage="home" />
      )}

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden bg-[#FDFBF7]">
          {/* Watermark */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[15vw] font-serif font-black text-[#0D5C53]/5 whitespace-nowrap select-none pointer-events-none z-0">
            Sri Lankan
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              {/* Left Content */}
              <div className="w-full lg:w-[55%] flex flex-col gap-6 sm:gap-8">
                <div>
                  <h1
                    className="font-serif text-4xl sm:text-5xl lg:text-[62px] font-bold leading-[1.15] text-gray-900 mb-6"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Authentic Weekly Meals,{' '}
                    <span className="text-[#0D5C53]">Delivered Fresh</span>
                  </h1>
                  <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-xl">
                    Breakfast. Lunch. Dinner. Seven days of real Sri Lankan home
                    cooking — delivered to you.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href="/meal-plans"
                    className="bg-[#0D5C53] hover:bg-[#09433D] text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl text-base sm:text-lg transition-all"
                  >
                    View Meal Plans
                  </Link>
                  <Link
                    href="/meal-plans"
                    className="bg-transparent border-2 border-[#0D5C53] text-[#0D5C53] hover:bg-[#0D5C53]/10 font-semibold px-8 py-4 rounded-full text-base sm:text-lg transition-all"
                  >
                    Learn More
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-stone-600 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#0D5C53]/15 flex items-center justify-center text-[#0D5C53]">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    Fresh Daily
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#0D5C53]/15 flex items-center justify-center text-[#0D5C53]">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    No Preservatives
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#0D5C53]/15 flex items-center justify-center text-[#0D5C53]">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    Weekly Plans
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#0D5C53]/15 flex items-center justify-center text-[#0D5C53]">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    Free Delivery Over Rs.2000
                  </div>
                </div>
              </div>

              {/* Right Image Container */}
              <div className="w-full lg:w-[45%] relative flex justify-center">
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[440px] lg:h-[440px] rounded-full overflow-hidden border-8 border-white shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1200"
                    alt="Sri Lankan Food Spread"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1 - Top Right */}
                <div className="absolute top-6 right-0 sm:-right-4 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">4.9 Rating</div>
                    <div className="text-xs text-stone-500">500+ Happy Customers</div>
                  </div>
                </div>

                {/* Floating Card 2 - Bottom Left */}
                <div className="absolute bottom-10 left-0 sm:-left-4 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3 z-20">
                  <div className="text-2xl">🍱</div>
                  <div className="font-bold text-gray-900 text-sm sm:text-base">
                    30+ Weekly Meal Options
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 sm:py-24 bg-[#F5F2EC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2
                className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                How 7Day Meals Works
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg">
                Simple, flexible, and delicious. Get started in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {[
                {
                  icon: '📅',
                  title: 'Choose Your Week',
                  desc: 'Select the week you want meals delivered.',
                },
                {
                  icon: '🍳',
                  title: 'Pick Your Meals',
                  desc: 'Customize breakfast, lunch & dinner.',
                },
                {
                  icon: '💳',
                  title: 'Secure Checkout',
                  desc: 'Pay safely online for your weekly plan.',
                },
                {
                  icon: '🚚',
                  title: 'Fresh Delivery',
                  desc: 'Enjoy fresh meals delivered daily.',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/70 text-center relative group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-16 h-16 mx-auto bg-[#E6F4F1] rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform text-[#0D5C53]">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="absolute -top-3.5 -right-3.5 w-8 h-8 bg-[#0D5C53] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Meals Section */}
        <section className="py-20 sm:py-24 bg-[#FDFBF7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2
                  className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  This Week's Popular Meals
                </h2>
                <p className="text-stone-600 text-base">
                  Handpicked Sri Lankan favorites
                </p>
              </div>
              <Link
                href="/meal-plans"
                className="flex items-center gap-2 text-[#0D5C53] font-bold hover:text-[#09433D] transition-colors group text-sm sm:text-base"
              >
                View All Meals{' '}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Horizontal Scroll Carousel */}
            <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0 mt-8 group/carousel">
              {/* Fade edges */}
              <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none hidden sm:block opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
              <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none hidden sm:block opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
              
              {/* Navigation Buttons */}
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 w-12 h-12 bg-white rounded-full shadow-lg border border-stone-200 text-stone-600 hover:text-[#0D5C53] hover:scale-105 flex items-center justify-center z-20 opacity-0 group-hover/carousel:opacity-100 transition-all hidden sm:flex"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 w-12 h-12 bg-white rounded-full shadow-lg border border-stone-200 text-stone-600 hover:text-[#0D5C53] hover:scale-105 flex items-center justify-center z-20 opacity-0 group-hover/carousel:opacity-100 transition-all hidden sm:flex"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
              >
                {loadingMeals ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="min-w-[280px] sm:min-w-[320px] h-[400px] bg-stone-100 animate-pulse rounded-2xl flex-shrink-0 snap-center" />
                  ))
                ) : (
                  featuredMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="min-w-[280px] sm:min-w-[320px] max-w-[320px] flex-shrink-0 snap-center"
                    >
                      <MealCard plan={meal} onAddToCart={handleAddToCart} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 sm:py-24 bg-[#1E293B] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-[#0D5C53]/30 rounded-full flex items-center justify-center text-[#34D399] text-3xl mb-6 mx-auto md:mx-0">
                  🥘
                </div>
                <h3
                  className="font-serif text-2xl font-bold mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Authentic Recipes
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  Made by Sri Lankan chefs using traditional recipes passed down
                  through generations.
                </p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-[#0D5C53]/30 rounded-full flex items-center justify-center text-[#34D399] text-3xl mb-6 mx-auto md:mx-0">
                  🥬
                </div>
                <h3
                  className="font-serif text-2xl font-bold mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Fresh Ingredients
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  Sourced daily from local markets — no frozen meals, no
                  preservatives.
                </p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-16 h-16 bg-[#0D5C53]/30 rounded-full flex items-center justify-center text-[#34D399] text-3xl mb-6 mx-auto md:mx-0">
                  🔄
                </div>
                <h3
                  className="font-serif text-2xl font-bold mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Flexible Plans
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                  Subscribe weekly or order one-time — pause or cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-[#0D5C53] to-[#083E38] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Ready for a Week of Real Sri Lankan Food?
            </h2>
            <p className="text-lg sm:text-xl text-teal-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Subscribe today and get your first week delivered fresh to your
              door.
            </p>
            <Link
              href="/meal-plans"
              className="inline-block bg-[#1E293B] hover:bg-black text-white font-bold text-base sm:text-lg px-10 py-4 sm:py-5 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Your Meal Plan
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
