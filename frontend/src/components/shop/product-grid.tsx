import React from "react";
import { Product } from "../../types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onProductClick?: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, onProductClick }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white h-[380px] animate-pulse flex flex-col overflow-hidden"
          >
            <div className="h-48 w-full bg-slate-200" />
            <div className="p-5 flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 bg-slate-200 rounded" />
                <div className="h-5 w-24 bg-slate-200 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-full bg-slate-200 rounded" />
                <div className="h-4 w-5/6 bg-slate-200 rounded" />
              </div>
              <div className="border-t border-slate-100 pt-4 flex gap-2">
                <div className="h-4 w-12 bg-slate-200 rounded" />
                <div className="h-4 w-12 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-16 bg-white shadow-sm text-center">
        <svg
          className="h-12 w-12 text-slate-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="text-lg font-bold text-slate-800">No products found</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          We couldn&apos;t find any products matching your filters. Try clearing some filters or exploring other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onProductClick} />
      ))}
    </div>
  );
}
