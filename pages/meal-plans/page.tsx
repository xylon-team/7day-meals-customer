'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MealCard } from '@/components/meal-plans/MealCard';
import { FilterBar, CategoryFilter, SortOption } from '@/components/meal-plans/FilterBar';
import { SearchBar } from '@/components/meal-plans/SearchBar';
import { MealDetailModal } from '@/components/meal-plans/MealDetailModal';
import { MealPlan } from '@/lib/data/meal-plans';
import { fetchMealPlans, mapApiMealToMealPlan } from '@/lib/api/meals';
import { ShoppingBag, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [selectedMealDetail, setSelectedMealDetail] = useState<MealPlan | null>(null);

  const { cart, addToCart } = useStore();
  const [mounted, setMounted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch meal plans from NestJS backend
  const loadMealPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawApiMeals = await fetchMealPlans();
      const mapped = rawApiMeals.map(mapApiMealToMealPlan);
      setMealPlans(mapped);
    } catch (err: any) {
      console.error('Failed to load meal plans from backend:', err);
      setError(
        err?.message || 'Failed to load meal plans from the server. Please check your backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMealPlans();
  }, [loadMealPlans]);

  // Add item to cart
  const handleAddToCart = (plan: MealPlan) => {
    addToCart(plan);
    setToastMessage(`"${plan.title}" added to cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter and Sort meal plans
  const filteredAndSortedPlans = useMemo(() => {
    return mealPlans
      .filter((plan) => {
        // Category filter
        let matchesCategory = selectedCategory === 'All';
        if (!matchesCategory) {
          const cat = plan.category.toLowerCase();
          const sel = selectedCategory.toLowerCase();
          if (sel === 'vegetarian') {
            matchesCategory = cat.includes('veg') && !cat.includes('non');
          } else if (sel === 'non-veg') {
            matchesCategory = cat.includes('non') || cat.includes('protein');
          } else if (sel === 'vegan') {
            matchesCategory = cat.includes('vegan');
          } else if (sel === 'gluten-free') {
            matchesCategory = cat.includes('gluten') || cat.includes('free');
          } else {
            matchesCategory = cat === sel;
          }
        }

        // Search filter (title, category, description, or food items)
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          plan.title.toLowerCase().includes(q) ||
          plan.category.toLowerCase().includes(q) ||
          (plan.description && plan.description.toLowerCase().includes(q)) ||
          plan.items.some((item) => item.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return b.popularity - a.popularity; // Default: Popularity
      });
  }, [mealPlans, selectedCategory, searchQuery, sortBy]);

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
      <Header
        cartCount={mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0}
        activeTab="Meals"
      />

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

        {/* Backend Error Alert */}
        {error && (
          <div className="my-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-rose-800 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Failed to load meal plans</h4>
                <p className="text-xs text-rose-600">{error}</p>
              </div>
            </div>
            <button
              onClick={loadMealPlans}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading Skeleton Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 my-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/70 p-5 flex flex-col gap-4 animate-pulse"
              >
                <div className="w-full h-48 bg-stone-200 rounded-xl" />
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-6 bg-stone-200 rounded w-16" />
                  <div className="h-6 bg-stone-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedPlans.length > 0 ? (
          /* Meal Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 my-8">
            {filteredAndSortedPlans.map((plan) => (
              <MealCard
                key={plan.id}
                plan={plan}
                onAddToCart={handleAddToCart}
                onViewDetails={(p) => setSelectedMealDetail(p)}
              />
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

      {/* Detail Modal */}
      {selectedMealDetail && (
        <MealDetailModal
          plan={selectedMealDetail}
          onClose={() => setSelectedMealDetail(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
