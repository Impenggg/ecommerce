"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { apiService } from "../../../../services/api";
import { Category } from "../../../../types";
import { ProductForm } from "../../../../components/admin/product-form";
import { Button } from "../../../../components/ui/button";
import { useToast } from "../../../../components/ui/toast";

export default function AdminCreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const { addToast } = useToast();

  // Fetch Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await apiService.getCategories();
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to load categories for form", err);
        setErrorMsg("Failed to load product categories. Please check if the backend is running.");
      }
    }
    loadCategories();
  }, []);

  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setFieldErrors(null);

    try {
      await apiService.createProduct(values);
      // Success redirect
      addToast("success", "Product created successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      console.error("Failed to create product", err);
      // Format validation errors or general message from Laravel
      if (err.errors) {
        setFieldErrors(err.errors);

        // Build a user-friendly error summary string
        const allMessages: string[] = [];
        Object.entries(err.errors).forEach(([field, msgs]) => {
          if (Array.isArray(msgs)) {
            msgs.forEach((m) => allMessages.push(m));
          }
        });
        const errorMessage = allMessages.join(" ") || "Validation errors occurred on the server.";
        setErrorMsg(errorMessage);
        addToast("error", errorMessage);
      } else {
        const errorMessage = err.message || "A network or server error occurred. Please try again.";
        setErrorMsg(errorMessage);
        addToast("error", errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/admin/products"
          className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Inventory
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-medium">Create Product</span>
      </nav>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Create Product
        </h1>
        <p className="text-base text-slate-600">
          Add a new product to your catalog with variants, pricing, and inventory details.
        </p>
      </div>

      {/* Backend/General Errors Alert */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold text-red-950 text-sm">Unable to create product</h4>
            <p className="mt-1 text-sm">{errorMsg}</p>

            {/* Detailed fields errors from backend validation if any */}
            {fieldErrors && Object.keys(fieldErrors).length > 0 && (
              <div className="mt-3 p-3 bg-red-100/50 rounded-lg">
                <p className="text-xs font-semibold text-red-900 mb-2">Validation errors:</p>
                <ul className="mt-2 list-disc list-inside text-xs space-y-1 text-red-800">
                  {Object.entries(fieldErrors).map(([field, msgs]) => (
                    <li key={field}>
                      <strong>{field.replace(/\./g, ' → ')}:</strong> {msgs.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form Component */}
      <ProductForm
        categories={categories}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
