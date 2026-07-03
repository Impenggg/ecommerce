import React from "react";
import { Product } from "../../types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const variants = product.variants || [];
  
  // Calculate price range
  const prices = variants.map((v) => parseFloat(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceDisplay =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

  // Extract unique colors & sizes
  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[];

  // Render a clean gradient placeholder for product image
  const getGradientForCategory = (catId: number) => {
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
    <Card className="group overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300 border border-slate-200">
      {/* Product Image area */}
      <div className={`relative h-48 w-full bg-gradient-to-br ${getGradientForCategory(product.category_id)} flex items-center justify-center text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        <span className="text-4xl font-black tracking-widest uppercase opacity-25 group-hover:scale-110 transition-transform duration-300">
          {product.title.split(" ").map((w) => w[0]).join("").slice(0, 3)}
        </span>
      </div>

      {/* Product Details */}
      <CardContent className="p-5 flex flex-col flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            {product.category?.name || "Catalog"}
          </span>
          <span className="text-lg font-extrabold text-blue-600 font-mono">
            {priceDisplay}
          </span>
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description || "No description provided."}
          </p>
        </div>

        {/* Colors and Sizes info */}
        <div className="border-t border-slate-100 pt-3 flex flex-col gap-2.5">
          {/* Colors */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Colors:
              </span>
              <div className="flex items-center gap-1">
                {colors.map((color) => (
                  <span
                    key={color}
                    className="inline-block h-3.5 px-1.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                    title={color}
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Sizes:
              </span>
              <div className="flex items-center gap-1">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="text-[10px] font-semibold text-slate-600 px-1 bg-slate-50 border rounded font-mono"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
