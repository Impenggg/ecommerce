import React from "react";
import { Category } from "../../types";
import { Button } from "../ui/button";

interface FilterSidebarProps {
  categories: Category[];
  colors: string[];
  selectedCategory: string | null;
  selectedColor: string | null;
  onSelectCategory: (id: string | null) => void;
  onSelectColor: (color: string | null) => void;
  onClear: () => void;
}

export function FilterSidebar({
  categories,
  colors,
  selectedCategory,
  selectedColor,
  onSelectCategory,
  onSelectColor,
  onClear,
}: FilterSidebarProps) {
  const hasActiveFilters = selectedCategory !== null || selectedColor !== null;

  return (
    <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
      {/* Title & Clear Action */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
          <svg
            className="h-5 w-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v3.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z"
            />
          </svg>
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="link"
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-400 p-0 h-auto"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Categories
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
              selectedCategory === null
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => {
            const isSelected = selectedCategory === String(category.id);
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(String(category.id))}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-medium ${
                  isSelected
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors Filter */}
      {colors.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Colors
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {colors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => onSelectColor(isSelected ? null : color)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
