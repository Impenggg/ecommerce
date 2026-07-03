"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus, Package, Layers, AlertCircle } from "lucide-react";

import { apiService } from "../../../services/api";
import { InventoryItem } from "../../../types";
import { columns } from "../../../components/admin/inventory-table/columns";
import { DataTable } from "../../../components/admin/inventory-table/data-table";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function AdminProductsPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Stats
  const [totalVariants, setTotalVariants] = useState(0);
  const [totalStock, setTotalStock] = useState(0);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Search Debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search]);

  // Load Inventory Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getInventory({
        search: debouncedSearch,
        sort_by: sortBy,
        sort_order: sortOrder,
        page,
        per_page: 10,
      });

      setData(response.data);
      setPageCount(response.meta.last_page);
      setTotalCount(response.meta.total);

      // Simple metric calculation
      let variants = 0;
      let stock = 0;
      response.data.forEach((item) => {
        variants += item.variants_count;
        stock += item.total_stock;
      });
      setTotalVariants(variants);
      setTotalStock(stock);
    } catch (error) {
      console.error("Failed to load inventory data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedSearch, sortBy, sortOrder, page]);

  // Handle Sorting Toggles
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1); // Reset to page 1
  };

  const tableColumns = columns(handleSort, sortBy, sortOrder);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventory Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your catalog products, view SKU summaries, and monitor stock levels.
          </p>
        </div>
        <div>
          <Link href="/admin/products/create" passHref legacyBehavior>
            <Button className="flex items-center gap-2 font-medium">
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{totalCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unique Variants</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {isLoading ? "..." : data.reduce((acc, curr) => acc + curr.variants_count, 0)}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`p-3 rounded-lg ${totalStock < 50 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Aggregate Stock</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                {isLoading ? "..." : data.reduce((acc, curr) => acc + curr.total_stock, 0)}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        columns={tableColumns}
        data={data}
        pageCount={pageCount}
        pageIndex={page}
        onPageChange={setPage}
        searchVal={search}
        onSearchValChange={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
