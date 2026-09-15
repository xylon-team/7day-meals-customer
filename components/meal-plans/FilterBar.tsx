'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export type CategoryFilter = 'All' | 'Vegetarian' | 'Non-Veg' | 'Vegan' | 'Gluten-Free';
export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'title';

interface FilterBarProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  sortBy: SortOption;
  onSelectSortBy: (sort: SortOption) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
}) => {
  const categories: CategoryFilter[] = [
    'All',
    'Vegetarian',
    'Non-Veg',
    'Vegan',
    'Gluten-Free',
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-3.5 border border-stone-200/70 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 my-6">
      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = cat === selectedCategory;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#0D5C53] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
        <span className="text-xs font-medium text-stone-500">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSelectSortBy(e.target.value as SortOption)}
            className="appearance-none bg-stone-100 border-none hover:bg-stone-200/80 text-stone-800 font-semibold text-xs rounded-xl px-4 py-2 pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D5C53]/20 transition-colors"
          >
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title">Name: A to Z</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
