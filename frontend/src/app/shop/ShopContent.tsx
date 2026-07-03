"use client";

import React, { useTransition, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { X, ShoppingBag, Tag, Layers } from "lucide-react";

import { Category, Product } from "../../types";
import { FilterSidebar } from "../../components/shop/filter-sidebar";
import { ProductGrid } from "../../components/shop/product-grid";

interface ShopContentProps {
  categories: Category[];
  colors: string[];
  products: Product[];
}

export function ShopContent({ categories, colors, products }: ShopContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryIdParam = searchParams.get("category_id");
  const colorParam = searchParams.get("color");

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleClearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Helper for gradient
  const getGradient = (catId: number) => {
    const gradients = [
      "from-blue-500 to-indigo-600",
      "from-emerald-400 to-teal-600",
      "from-amber-400 to-orange-500",
      "from-rose-400 to-pink-600",
      "from-violet-500 to-purple-700",
    ];
    return gradients[(catId - 1) % gradients.length] || "from-slate-400 to-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <span className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg p-1.5 text-xs font-black tracking-wide">
              SHOP
            </span>
            <span>App Solutions Catalog</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 hover:text-blue-600 hover:border-blue-300 h-9 px-4 py-2 transition-all"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white py-14">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-200 mb-2">
            Premium Product Catalog
          </p>
          <h1 className="text-5xl font-black tracking-tight">E-Commerce Catalog</h1>
          <p className="mt-3 text-slate-200 max-w-xl text-sm leading-relaxed">
            Discover a wide selection of premium items. Filter by categories or colors to find exactly what you need.
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-blue-100">
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4" />
              {products.length} Products
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              {categories.length} Categories
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              {colors.length} Colors
            </span>
          </div>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <FilterSidebar
            categories={categories}
            colors={colors}
            selectedCategory={categoryIdParam}
            selectedColor={colorParam}
            onSelectCategory={(id) => handleFilterChange("category_id", id)}
            onSelectColor={(color) => handleFilterChange("color", color)}
            onClear={handleClearFilters}
          />

          {/* Catalog grid */}
          <div className="flex-1 space-y-5">
            <div className="flex justify-between items-center text-sm text-slate-500 border-b pb-4">
              <div>
                Showing{" "}
                <span className="font-semibold text-slate-800">{products.length}</span>{" "}
                {products.length === 1 ? "product" : "products"}
                {(categoryIdParam || colorParam) && (
                  <span className="ml-2 text-xs text-blue-600 font-medium">
                    (filtered)
                  </span>
                )}
              </div>
              {isPending && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                  Updating...
                </div>
              )}
            </div>

            <ProductGrid
              products={products}
              isLoading={isPending}
              onProductClick={(p) => setSelectedProduct(p)}
            />
          </div>
        </div>
      </div>

      {/* ── Product Detail Modal ── */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className={`relative h-48 w-full bg-gradient-to-br ${getGradient(selectedProduct.category_id)} flex items-center justify-center shrink-0`}
            >
              <span className="text-6xl font-black tracking-widest uppercase text-white/20 select-none">
                {selectedProduct.title.split(" ").map((w) => w[0]).join("").slice(0, 3)}
              </span>
              {/* Category badge */}
              <span className="absolute top-4 left-4 bg-white/20 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
                {selectedProduct.category?.name || "Catalog"}
              </span>
              {/* Close button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-full p-2 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    {selectedProduct.description || "No description provided for this product."}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {(() => {
                    const prices = (selectedProduct.variants || []).map((v) => parseFloat(v.price));
                    const min = prices.length > 0 ? Math.min(...prices) : 0;
                    const max = prices.length > 0 ? Math.max(...prices) : 0;
                    return (
                      <span className="text-2xl font-black text-blue-600 font-mono">
                        {min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)}–$${max.toFixed(2)}`}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Variants Table */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                    Available Variants
                  </h3>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">SKU</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Size</th>
                          <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Color</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Price</th>
                          <th className="text-right px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedProduct.variants.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-slate-700 font-semibold">{v.sku}</td>
                            <td className="px-4 py-3">
                              {v.size ? (
                                <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 font-mono">
                                  {v.size}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {v.color ? (
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-700">
                                  <span
                                    className="inline-block h-3 w-3 rounded-full border border-slate-200"
                                    style={{ background: v.color.toLowerCase() }}
                                  />
                                  {v.color}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                              ${parseFloat(v.price).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`font-mono font-bold text-xs ${
                                  v.stock_quantity === 0
                                    ? "text-red-500"
                                    : v.stock_quantity < 10
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {v.stock_quantity === 0 ? "Out of stock" : `${v.stock_quantity} units`}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                {selectedProduct.variants?.length || 0} variant{(selectedProduct.variants?.length || 0) !== 1 ? "s" : ""} available
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-sm font-medium px-4 py-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
