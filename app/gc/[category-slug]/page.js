"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/common/products/ProductCard";
import ProductCardSkeleton from "../../components/common/products/ProductCardSkeleton";
import CategoryAdBanner from "../../components/common/products/CategoryAdBanner";
import ProductFilter from "../../components/common/ProductFilter";
import { categoryApi } from "../../redux/services/apiService";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("gc_id");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getCategoryProducts(categoryId);
        if (response.success) {
          setProducts(response.data.products || []);
          setCategory(response.data.category);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchData();
    }
  }, [categoryId]);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Child Category Menu */}
      <nav className="flex gap-6 px-4 py-2 border justify-between border-gray-300 bg-gray-50">
        <span className="font-semibold text-sm text-blue-700">{category?.name || "Loading..."}</span>
        {/* Add subcategories here when available */}
      </nav>

      {/* Main Content: Sidebar + Product Grid Area */}
      <div className="flex flex-1 px-2 gap-8 mt-4">
        {/* Sidebar Filter */}
        <ProductFilter />

        {/* Product Grid Area */}
        <section className="flex-1 flex flex-col">
          <CategoryAdBanner />

          <h2 className="text-xl font-semibold mb-4">{category?.name || "Loading..."}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
            {loading ? (
              // Show skeleton loading
              Array.from({ length: 12 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              // Show actual products
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
