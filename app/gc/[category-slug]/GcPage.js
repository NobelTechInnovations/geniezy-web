"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "../../components/common/products/ProductCard";
import ProductCardSkeleton from "../../components/common/products/ProductCardSkeleton";
import CategoryAdBanner from "../../components/common/products/CategoryAdBanner";
import ProductFilter from "../../components/common/ProductFilter";
import RecommendationRail from "../../components/common/RecommendationRail";
import { categoryApi, eventApi } from "../../redux/services/apiService";
import { useBrowsingHistory } from "../../hooks/useBrowsingHistory";
import { getLocationFromLocalStorage } from "../../components/common/LocationDropdown";
import { getAnonymousId } from "../../services/browsingHistory/anonymousId";

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("gc_id");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [rootCategory, setRootCategory] = useState(null);
  const [category_tree, setCategoryTree] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({});
  // When the buyer's location excludes every (or some) sellers for this
  // category, hasOutOfRange tells us the toggle is worth showing; showAll
  // is the buyer's choice to actually see those out-of-range products,
  // each labeled 'standard' delivery instead of 'same_day'.
  const [hasOutOfRange, setHasOutOfRange] = useState(false);
  const [showAllDelivery, setShowAllDelivery] = useState(false);
  const { addToHistory } = useBrowsingHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const location = getLocationFromLocalStorage();
        const response = await categoryApi.getCategoryProducts(categoryId, {
          lat: location?.latitude,
          lng: location?.longitude,
          ...filters,
          includeOutOfRange: showAllDelivery,
        });
        if (response.success) {
          setProducts(response.data.products || []);
          setCategory(response.data.category);
          setRootCategory(response.data.root_category_with_children);
          setCategoryTree(response.data.category_tree || []);
          setBrands(response.data.facets?.brands || []);
          setHasOutOfRange(!!response.data.has_out_of_range_products);

          // Add category to browsing history
          if (response.data.category) {
            addToHistory({
              type: 'category',
              categoryId: btoa(response.data.category._id),
              categoryName: response.data.category.name,
              categorySlug: response.data.category.slug,
              parentCategory: response.data.root_category_with_children?.name || null,
            });

            // Server-side tracking for home-feed personalization.
            eventApi.track({
              eventType: 'view_category',
              categoryId: response.data.category._id,
              anonId: getAnonymousId(),
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
  }, [categoryId, addToHistory, filters, showAllDelivery]);

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
      <div className="flex flex-1 px-2 gap-2 ">
        {/* Sidebar Filter */}
        <ProductFilter
          categoryId={categoryId}
          subcategories={rootCategory?.children || []}
          brands={brands}
          onFilterChange={setFilters}
        />

        {/* Product Grid Area */}
        {/* min-w-0 — see the note on the same element in
            app/search/SearchResultsClient.js: without it this flex child
            can't shrink below its grid content and the page overflows
            horizontally on mobile. */}
        <section className="flex-1 min-w-0 flex flex-col ">

        <div className="flex items-center gap-2 text-sm mb-2 ">
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

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{category?.name || "Loading..."}</h2>
            {(hasOutOfRange || showAllDelivery) && (
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showAllDelivery}
                  onChange={(e) => setShowAllDelivery(e.target.checked)}
                  className="accent-blue-600"
                />
                Show all products (Standard Delivery too)
              </label>
            )}
          </div>

          {!loading && showAllDelivery === false && hasOutOfRange && products.length === 0 && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
              No sellers currently deliver this same-day to your location.{' '}
              <button
                type="button"
                onClick={() => setShowAllDelivery(true)}
                className="underline font-semibold"
              >
                Show all products with Standard Delivery
              </button>
              {' '}instead.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
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

          {!loading && <RecommendationRail context="category" categoryId={categoryId} />}
        </section>
      </div>
    </main>
  );
}
