import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/products" className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <span className="bg-blue-600 text-white rounded p-1 text-xs">APP</span>
              <span>Solutions Admin</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/admin/products"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Inventory Table
              </Link>
              <Link
                href="/admin/products/create"
                className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
              >
                Create Product
              </Link>
            </nav>
          </div>
          <div>
            <Link
              href="/shop"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition-all flex items-center gap-1"
            >
              Go to Public Shop &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
