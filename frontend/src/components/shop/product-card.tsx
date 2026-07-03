import React from "react";
import { Product } from "../../types";
import { Card, CardContent } from "../ui/card";

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const variants = product.variants || [];

  const prices = variants.map((v) => parseFloat(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const priceDisplay =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;

  const colors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[];
  const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))) as string[];

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
    <button
      onClick={() => onClick?.(product)}
      className="text-left w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
      aria-label={`View details for ${product.title}`}
    >
      <Card className="overflow-hidden flex flex-col h-full border border-slate-200 group-hover:shadow-xl group-hover:border-blue-300 group-hover:-translate-y-1 transition-all duration-300">
        {/* Product Image area */}
        <div
          className={`relative h-48 w-full bg-gradient-to-br ${getGradientForCategory(product.category_id)} flex items-center justify-center text-white overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
          <span className="text-4xl font-black tracking-widest uppercase opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300">
            {product.title.split(" ").map((w) => w[0]).join("").slice(0, 3)}
          </span>
          <span className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
            View Details →
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

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            {colors.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Colors:</span>
                {colors.map((color) => (
                  <span
                    key={color}
                    className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                  >
                    {color}
                  </span>
                ))}
              </div>
            )}
            {sizes.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sizes:</span>
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="text-[10px] font-semibold text-slate-600 px-1.5 py-0.5 bg-slate-50 border rounded font-mono"
                  >
                    {size}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
