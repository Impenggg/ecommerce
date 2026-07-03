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
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/products" className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <span className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg p-1.5 text-xs font-black tracking-wide">
                SHOP
              </span>
              <span>App Solutions Admin</span>
            </Link>
          </div>
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-100 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-lg transition-all"
            >
              View Shop →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {children}
      </main>
    </div>
  );
}

