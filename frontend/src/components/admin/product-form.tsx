"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Loader2 } from "lucide-react";

import { Category } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../ui/toast";

// Define Form Validation Schema with Zod
const variantSchema = z.object({
  id: z.number().optional(),
  sku: z
    .string()
    .min(3, "SKU must be at least 3 characters")
    .max(50, "SKU cannot exceed 50 characters")
    .regex(/^[A-Z0-9_-]+$/i, "SKU can only contain alphanumeric characters, hyphens, and underscores"),
  size: z.string().max(20, "Size is too long").optional().or(z.literal("")),
  color: z.string().max(20, "Color is too long").optional().or(z.literal("")),
  price: z
    .coerce
    .number()
    .positive("Price must be a positive number"),
  stock_quantity: z
    .coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
});

const productSchema = z.object({
  title: z
    .string()
    .min(3, "Product title must be at least 3 characters")
    .max(255, "Product title cannot exceed 255 characters"),
  description: z.string().optional().or(z.literal("")),
  category_id: z.union([
    z.literal("new"),
    z.coerce.number().min(1, "Please select a valid category")
  ]),
  variants: z
    .array(variantSchema)
    .min(1, "You must define at least one product variant"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Category[];
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isSubmitting?: boolean;
  initialValues?: ProductFormValues;
  submitLabel?: string;
}

export function ProductForm({
  categories,
  onSubmit,
  isSubmitting = false,
  initialValues,
  submitLabel = "Create Product",
}: ProductFormProps) {
  const [isNewCategory, setIsNewCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const { addToast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialValues || {
      title: "",
      description: "",
      category_id: undefined,
      variants: [
        {
          sku: "",
          size: "",
          color: "",
          price: 0,
          stock_quantity: 0,
        },
      ],
    },
  });

  const categoryIdValue = watch("category_id");

  React.useEffect(() => {
    if (categoryIdValue === "new") {
      setIsNewCategory(true);
    } else {
      setIsNewCategory(false);
      setNewCategoryName("");
    }
  }, [categoryIdValue]);

  // Show toast notification when validation errors occur
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors)
        .map((err) => err?.message)
        .filter(Boolean);
      if (errorMessages.length > 0) {
        addToast("error", `Validation error: ${errorMessages[0]}`);
      }
    }
  }, [errors, addToast]);

  // Reset form when initial values load from async API
  React.useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleFormSubmit = async (data: ProductFormValues) => {
    // If new category is selected, validate and include the new category name
    if (isNewCategory) {
      if (!newCategoryName.trim()) {
        addToast("error", "Please enter a category name");
        return;
      }
      (data as any).new_category_name = newCategoryName.trim();
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Product Details Card */}
      <Card className="shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 border-b pb-2 mb-4">
            Product Details
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="title" className="text-sm font-semibold text-slate-700">
                Product Title
              </label>
              <Input
                id="title"
                placeholder="e.g., Wireless Gaming Headset"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <span className="text-xs font-medium text-red-500">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Category Select */}
            <div className="flex flex-col space-y-1.5">
              <Select
                id="category_id"
                label="Category"
                {...register("category_id")}
                error={errors.category_id?.message}
                defaultValue=""
              >
                <option value="" disabled>
                  Select category...
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="new" className="font-semibold text-blue-600 bg-blue-50">
                  + Add New Category
                </option>
              </Select>
              {isNewCategory && (
                <div className="mt-2">
                  <label htmlFor="new_category_name" className="text-xs font-semibold text-slate-600">
                    New Category Name
                  </label>
                  <Input
                    id="new_category_name"
                    placeholder="Enter new category name..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="mt-1"
                    required={isNewCategory}
                  />
                  {newCategoryName.trim().length === 0 && (
                    <span className="text-xs font-medium text-red-500 mt-1">
                      Category name is required when adding a new category
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-1.5 mt-4">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Provide a detailed description of the product..."
              {...register("description")}
              className="flex w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && (
              <span className="text-xs font-medium text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Variants Card */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Product Variants
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  sku: "",
                  size: "",
                  color: "",
                  price: 0,
                  stock_quantity: 0,
                })
              }
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add Variant
            </Button>
          </div>

          {errors.variants?.root && (
            <div className="mb-4 text-sm font-medium text-red-500 bg-red-50 p-2.5 rounded border border-red-200">
              {errors.variants.root.message}
            </div>
          )}

          {/* Dynamic Inputs Array */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const rowErrors = errors.variants?.[index];

              return (
                <div
                  key={field.id}
                  className="grid gap-3 items-end border border-slate-100 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors md:grid-cols-6"
                >
                  {/* SKU */}
                  <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      SKU
                    </label>
                    <Input
                      placeholder="e.g. HEADSET-BLK"
                      {...register(`variants.${index}.sku` as const)}
                      className={rowErrors?.sku ? "border-red-500 bg-white" : "bg-white"}
                    />
                    {rowErrors?.sku && (
                      <span className="text-xs font-medium text-red-500 mt-1">
                        {rowErrors.sku.message}
                      </span>
                    )}
                  </div>

                  {/* Size */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Size
                    </label>
                    <Input
                      placeholder="e.g. S, M, L"
                      {...register(`variants.${index}.size` as const)}
                      className={rowErrors?.size ? "border-red-500 bg-white" : "bg-white"}
                    />
                    {rowErrors?.size && (
                      <span className="text-xs font-medium text-red-500 mt-1">
                        {rowErrors.size.message}
                      </span>
                    )}
                  </div>

                  {/* Color */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Color
                    </label>
                    <Input
                      placeholder="e.g. Red, Blue"
                      {...register(`variants.${index}.color` as const)}
                      className={rowErrors?.color ? "border-red-500 bg-white" : "bg-white"}
                    />
                    {rowErrors?.color && (
                      <span className="text-xs font-medium text-red-500 mt-1">
                        {rowErrors.color.message}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Price ($)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register(`variants.${index}.price` as const)}
                      className={rowErrors?.price ? "border-red-500 bg-white" : "bg-white"}
                    />
                    {rowErrors?.price && (
                      <span className="text-xs font-medium text-red-500 mt-1">
                        {rowErrors.price.message}
                      </span>
                    )}
                  </div>

                  {/* Stock & Delete */}
                  <div className="flex items-center gap-2 md:col-span-1">
                    <div className="flex flex-col space-y-1 flex-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Stock
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        {...register(`variants.${index}.stock_quantity` as const)}
                        className={rowErrors?.stock_quantity ? "border-red-500 bg-white" : "bg-white"}
                      />
                      {rowErrors?.stock_quantity && (
                        <span className="text-xs font-medium text-red-500 mt-1">
                          {rowErrors.stock_quantity.message}
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      className="mb-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove variant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Submission Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
