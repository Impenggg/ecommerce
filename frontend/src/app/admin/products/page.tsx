"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Plus, Package, Layers, BarChart3, Trash2, AlertTriangle, X } from "lucide-react";

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

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [search]);

  const loadData = useCallback(async () => {
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
    } catch (error) {
      console.error("Failed to load inventory data", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, sortBy, sortOrder, page]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleDeleteRequest = (id: number, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await apiService.deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      console.error("Failed to delete product", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const tableColumns = columns(handleSort, sortBy, sortOrder, handleDeleteRequest);
  const totalVariants = data.reduce((acc, curr) => acc + curr.variants_count, 0);
  const totalStock = data.reduce((acc, curr) => acc + curr.total_stock, 0);

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-100">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-red-50 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Delete Product?</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-800">&ldquo;{deleteTarget.title}&rdquo;</span>?{" "}
                  This will also remove all its variants. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventory Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your catalog products, view SKU summaries, and monitor stock levels.
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-200 h-10 px-5 py-2 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{isLoading ? "…" : totalCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unique Variants</p>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{isLoading ? "…" : totalVariants}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`p-3 rounded-xl ${totalStock < 50 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Aggregate Stock</p>
              <h3 className="text-3xl font-black text-slate-900 mt-0.5">{isLoading ? "…" : totalStock}</h3>
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
