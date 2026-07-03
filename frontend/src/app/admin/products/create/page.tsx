"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { apiService } from "../../../../services/api";
import { Category } from "../../../../types";
import { ProductForm } from "../../../../components/admin/product-form";
import { Button } from "../../../../components/ui/button";

export default function AdminCreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);

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
        setErrorMsg(allMessages.join(" ") || "Validation errors occurred on the server.");
      } else {
        setErrorMsg(err.message || "A network or server error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back link */}
      <div>
        <Link href="/admin/products" passHref legacyBehavior>
          <Button variant="ghost" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 pl-0">
            <ChevronLeft className="h-4 w-4" />
            Back to Inventory
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Create Product
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a new product along with all its variant parameters to your catalog.
        </p>
      </div>

      {/* Backend/General Errors Alert */}
      {errorMsg && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-bold text-red-950">An error occurred</h4>
            <p className="mt-1">{errorMsg}</p>
            
            {/* Detailed fields errors from backend validation if any */}
            {fieldErrors && Object.keys(fieldErrors).length > 0 && (
              <ul className="mt-2 list-disc list-inside text-xs space-y-0.5 text-red-900">
                {Object.entries(fieldErrors).map(([field, msgs]) => (
                  <li key={field}>
                    <strong>{field.replace(/\./g, ' -> ')}:</strong> {msgs.join(', ')}
                  </li>
                ))}
              </ul>
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
