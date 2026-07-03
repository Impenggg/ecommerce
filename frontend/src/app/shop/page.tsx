"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

import { apiService } from "../../services/api";
import { Category, Product } from "../../types";
import { FilterSidebar } from "../../components/shop/filter-sidebar";
import { ProductGrid } from "../../components/shop/product-grid";
import { Button } from "../../components/ui/button";

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Read filters from URL params
  const categoryIdParam = searchParams.get("category_id");
  const colorParam = searchParams.get("color");

  // Load Categories and Colors on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, colorRes] = await Promise.all([
          apiService.getCategories(),
          apiService.getColors(),
        ]);
        setCategories(catRes.data);
        setColors(colorRes.data);
      } catch (err) {
        console.error("Failed to load shop filter metadata", err);
      }
    }
    loadMeta();
  }, []);

  // Fetch products when filters in URL change
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const response = await apiService.getProducts({
          category_id: categoryIdParam || undefined,
          color: colorParam || undefined,
          per_page: 24, // Show more products on shop page
        });
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to load products list", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [categoryIdParam, colorParam]);

  // Helper to change search parameters without page reload
  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page on filter change
    
    // Perform soft router transition
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <span className="bg-blue-600 text-white rounded p-1 text-xs">SHOP</span>
            <span>App Solutions Catalog</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/products" passHref legacyBehavior>
              <Button variant="outline" className="text-sm font-medium">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">E-Commerce Product Catalog</h1>
          <p className="mt-2 text-slate-200 max-w-xl text-sm leading-relaxed">
            Discover a wide selection of premium items. Filter by categories or colors to find exactly what you need.
          </p>
        </div>
      </section>

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center text-sm text-slate-500 border-b pb-4">
              <div>
                Showing <span className="font-semibold text-slate-800">{products.length}</span>{" "}
                {products.length === 1 ? "product" : "products"}
              </div>
            </div>

            <ProductGrid products={products} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <span className="text-slate-500 text-sm font-medium">Loading Shop Catalog...</span>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
