"use client";
import React from "react";

/**
 * ProductSkeleton
 * Reusable skeleton placeholder for product detail page.
 * Uses Tailwind CSS utility classes and animate-pulse.
 */

export default function ProductSkeleton() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="max-w-8xl mx-auto px-2 py-4">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Gallery skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="w-full h-[420px] bg-gray-200 rounded-md border border-gray-100" />
            <div className="flex gap-3 mt-2">
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
              <div className="w-20 h-20 bg-gray-200 rounded-md" />
            </div>
          </div>

          {/* Info skeleton */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-8 w-full bg-gray-200 rounded" />
            <div className="h-6 w-1/4 bg-gray-200 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-20 w-full bg-gray-200 rounded" />
            <div className="flex gap-3">
              <div className="h-10 w-1/2 bg-gray-200 rounded" />
              <div className="h-10 w-1/3 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-full bg-gray-200 rounded mt-2" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>

          {/* Buy box skeleton */}
          <aside className="lg:col-span-3 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm shadow-xs p-6">
              <div className="h-8 w-1/2 bg-gray-200 rounded mb-4" />
              <div className="h-10 w-full bg-gray-200 rounded mb-3" />
              <div className="h-10 w-full bg-gray-200 rounded mb-3" />
              <div className="h-6 w-full bg-gray-200 rounded mb-6" />
              <div className="h-10 w-full bg-gray-200 rounded" />
            </div>
          </aside>
        </div>
      </div>

      {/* Specs skeleton */}
      <div className="max-w-6xl mx-auto px-4 pb-2">
        <div className="mt-8 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="mb-8 overflow-x-auto">
            <div className="min-w-full bg-white rounded shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    </main>
  );
}
