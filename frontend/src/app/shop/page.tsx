import React, { Suspense } from "react";
import { apiService } from "../../services/api";
import { ShopContent } from "./ShopContent";

interface PageProps {
  searchParams: Promise<{
    category_id?: string;
    color?: string;
  }>;
}

async function ShopLoader({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryId = params.category_id || undefined;
  const color = params.color || undefined;

  // Fetch initial data on the server side for SEO
  const [catRes, colorRes, productsRes] = await Promise.all([
    apiService.getCategories().catch((err) => {
      console.error("Failed to load categories on server", err);
      return { data: [] };
    }),
    apiService.getColors().catch((err) => {
      console.error("Failed to load colors on server", err);
      return { data: [] };
    }),
    apiService.getProducts({
      category_id: categoryId,
      color: color,
      per_page: 24,
    }).catch((err) => {
      console.error("Failed to load products on server", err);
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 24, total: 0 } };
    }),
  ]);

  return (
    <ShopContent
      categories={catRes.data}
      colors={colorRes.data}
      products={productsRes.data}
    />
  );
}

export default function ShopPage({ searchParams }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
            <span className="text-slate-500 text-sm font-medium">Loading Shop Catalog...</span>
          </div>
        </div>
      }
    >
      <ShopLoader searchParams={searchParams} />
    </Suspense>
  );
}
