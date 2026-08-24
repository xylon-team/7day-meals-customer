'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MealCard } from './components/MealCard';
import { FilterBar, CategoryFilter, SortOption } from './components/FilterBar';
import { SearchBar } from './components/SearchBar';
import { MEAL_PLANS, MealPlan } from '@/lib/data/meal-plans';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function MealPlansPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [cart, setCart] = useState<MealPlan[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add item to cart
  const handleAddToCart = (plan: MealPlan) => {
    setCart((prev) => [...prev, plan]);
    setToastMessage(`"${plan.title}" added to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter and Sort meal plans
  const filteredAndSortedPlans = useMemo(() => {
    return MEAL_PLANS.filter((plan) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || plan.category === selectedCategory;

      // Search filter (title, category, or food items)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        plan.title.toLowerCase().includes(q) ||
        plan.category.toLowerCase().includes(q) ||
        plan.items.some((item) => item.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.popularity - a.popularity; // Default: Popularity
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-gray-900 flex flex-col font-sans selection:bg-[#0D5C53] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0D5C53] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium border border-teal-600/40 animate-slide-up">
          <ShoppingBag className="w-4 h-4 text-teal-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header cartCount={cart.length} activeTab="Meals" />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              This Week's Meal Plans
            </h1>
            <p className="mt-2.5 text-stone-600 text-sm sm:text-base max-w-xl">
              Browse our authentic Sri Lankan menu and build your perfect week.
            </p>
          </div>

          {/* Search Bar on Right */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search meal plans..."
          />
        </div>

        {/* Filter and Controls Bar */}
        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSelectSortBy={setSortBy}
        />

        {/* Meal Cards Grid */}
        {filteredAndSortedPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 my-8">
            {filteredAndSortedPlans.map((plan) => (
              <MealCard key={plan.id} plan={plan} onAddToCart={handleAddToCart} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="my-16 bg-white rounded-3xl p-12 text-center border border-stone-200/70 shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No meal plans found</h3>
            <p className="text-xs text-stone-500 mb-6">
              We couldn't find any meal plans matching your search or selected filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="bg-[#0D5C53] hover:bg-[#09433D] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
