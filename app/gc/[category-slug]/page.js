"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../../components/common/products/ProductCard";
import ProductCardSkeleton from "../../components/common/products/ProductCardSkeleton";
import CategoryAdBanner from "../../components/common/products/CategoryAdBanner";
import ProductFilter from "../../components/common/ProductFilter";
import { categoryApi } from "../../redux/services/apiService";
import { useBrowsingHistory } from "../../hooks/useBrowsingHistory";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("gc_id");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [rootCategory, setRootCategory] = useState(null);
  const [category_tree, setCategoryTree] = useState([]);
  const { addToHistory } = useBrowsingHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getCategoryProducts(categoryId);
        if (response.success) {
          setProducts(response.data.products || []);
          setCategory(response.data.category);
          setRootCategory(response.data.root_category_with_children);
          setCategoryTree(response.data.category_tree || []);

          // Add category to browsing history
          if (response.data.category) {
            addToHistory({
              type: 'category',
              categoryId: response.data.category._id,
              categoryName: response.data.category.name,
              categorySlug: response.data.category.slug,
              parentCategory: response.data.root_category_with_children?.name || null,
            });
          }
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
  }, [categoryId, addToHistory]);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Child Category Menu */}
      <nav className="flex gap-6 px-4 py-2 border justify-between border-gray-300 bg-gray-50 overflow-x-auto">
        {rootCategory && (
          <>
            <Link 
              href={`/gc/${rootCategory.slug}?gc_id=${rootCategory._id}`}
              className="font-semibold text-sm text-blue-700 whitespace-nowrap"
            >
              {rootCategory.name}
            </Link>
            {rootCategory.children?.map((child) => (
              <Link
                key={child._id}
                href={`/gc/${child.slug}?gc_id=${child._id}`}
                className="text-gray-600 text-sm hover:text-blue-600 whitespace-nowrap"
              >
                {child.name}
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* Main Content: Sidebar + Product Grid Area */}
      <div className="flex flex-1 px-2 gap-8 mt-4">
        {/* Sidebar Filter */}
        <ProductFilter />

        {/* Product Grid Area */}
        <section className="flex-1 flex flex-col">

        <div className="flex items-center gap-2 text-sm mb-2">
          {category_tree?.map((cat, index) => (
            <div key={cat._id} className="flex items-center">
              <Link
                href={`/gc/${cat.slug}?gc_id=${cat._id}`}
                className={`${
                  index === category_tree.length - 1
                    ? 'text-blue-700 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {cat.name}
              </Link>
              {index < category_tree.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </div>
          ))}
        </div>

      
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
