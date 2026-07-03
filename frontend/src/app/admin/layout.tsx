import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, Plus, ShoppingBag, ChevronRight } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-30">
        {/* Logo */}
        <div className="p-6 border-b border-slate-100">
          <Link href="/admin/products" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <span className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg p-1.5 text-xs font-black tracking-wide">
              SHOP
            </span>
            <span>Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Inventory Dashboard
          </Link>
          <Link
            href="/admin/products/create"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Product
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100">
          <Link
            href="/shop"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            View Shop
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/admin/products" className="flex items-center gap-2 font-bold text-lg text-slate-900">
              <span className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg p-1.5 text-xs font-black tracking-wide">
                SHOP
              </span>
              <span>Admin</span>
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-100 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
            >
              View Shop →
            </Link>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-slate-900">Product Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-100 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-lg transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                View Shop →
              </Link>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

