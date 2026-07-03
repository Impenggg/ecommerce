"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { apiService } from "../../../../../services/api";
import { Category, Product } from "../../../../../types";
import { ProductForm } from "../../../../../components/admin/product-form";
import { Button } from "../../../../../components/ui/button";
import { useToast } from "../../../../../components/ui/toast";

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catRes, productRes] = await Promise.all([
          apiService.getCategories(),
          apiService.getProduct(productId),
        ]);
        setCategories(catRes.data);
        setProduct(productRes.data);
      } catch (err) {
        console.error("Failed to load product data", err);
        setErrorMsg("Failed to load product data. Please check if the backend is running.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [productId]);

  // Map API Product to form initial values
  const initialValues = product
    ? {
        title: product.title,
        description: product.description || "",
        category_id: product.category_id,
        variants: (product.variants || []).map((v) => ({
          id: v.id,
          sku: v.sku,
          size: v.size || "",
          color: v.color || "",
          price: parseFloat(v.price),
          stock_quantity: v.stock_quantity,
        })),
      }
    : undefined;

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setFieldErrors(null);
    try {
      await apiService.updateProduct(productId, values);
      addToast("success", "Product updated successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Failed to update product", err);
      if (err.errors) {
        setFieldErrors(err.errors);
        const allMessages: string[] = [];
        Object.entries(err.errors).forEach(([, msgs]) => {
          if (Array.isArray(msgs)) msgs.forEach((m) => allMessages.push(m));
        });
        const errorMessage = allMessages.join(" ") || "Validation errors occurred.";
        setErrorMsg(errorMessage);
        addToast("error", errorMessage);
      } else {
        const errorMessage = err.message || "A network or server error occurred.";
        setErrorMsg(errorMessage);
        addToast("error", errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Inventory
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Edit Product</h1>
        <p className="text-sm text-slate-500 mt-1">
          Update product details and manage its variants below.
        </p>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-sm font-medium">Loading product data...</span>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && !isLoading && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-bold text-red-950">An error occurred</h4>
            <p className="mt-1">{errorMsg}</p>
            {fieldErrors && Object.keys(fieldErrors).length > 0 && (
              <ul className="mt-2 list-disc list-inside text-xs space-y-0.5 text-red-900">
                {Object.entries(fieldErrors).map(([field, msgs]) => (
                  <li key={field}>
                    <strong>{field.replace(/\./g, " -> ")}:</strong> {msgs.join(", ")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Form (shown after load) */}
      {!isLoading && product && (
        <ProductForm
          categories={categories}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          initialValues={initialValues}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
}
