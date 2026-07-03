"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "../../../types";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import Link from "next/link";

export const columns = (
  onSort: (field: string) => void,
  sortField: string,
  sortOrder: "asc" | "desc",
  onDelete?: (id: number, title: string) => void
): ColumnDef<InventoryItem>[] => [
  {
    accessorKey: "title",
    header: () => {
      const isCurrentSort = sortField === "title";
      return (
        <Button
          variant="ghost"
          onClick={() => onSort("title")}
          className="-ml-4 h-8 px-2 font-semibold text-slate-700 flex items-center gap-1"
        >
          Product Title
          <ArrowUpDown className={`h-4 w-4 transition-transform ${isCurrentSort && sortOrder === "desc" ? "rotate-180" : ""}`} />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "category_name",
    header: "Category",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
        {row.getValue("category_name")}
      </span>
    ),
  },
  {
    accessorKey: "variants_count",
    header: "Variant Count",
    cell: ({ row }) => (
      <span className="text-slate-600 font-mono">{row.getValue("variants_count")}</span>
    ),
  },
  {
    accessorKey: "total_stock",
    header: "Total Stock",
    cell: ({ row }) => {
      const stock = row.getValue("total_stock") as number;
      return (
        <span
          className={`font-mono font-semibold ${
            stock === 0
              ? "text-red-600"
              : stock < 10
              ? "text-amber-600"
              : "text-emerald-600"
          }`}
        >
          {stock}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("created_at") as string;
      const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <span className="text-slate-500 text-sm">{formattedDate}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${item.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 gap-1.5 text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              title="Edit product"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2.5 gap-1.5 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors"
            title="Delete product"
            onClick={() => onDelete?.(item.id, item.title)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      );
    },
  },
];
