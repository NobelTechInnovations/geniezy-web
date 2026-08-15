'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/common/products/ProductCard';
import ProductCardSkeleton from '../components/common/products/ProductCardSkeleton';
import ProductFilter from '../components/common/ProductFilter';
import RecommendationRail from '../components/common/RecommendationRail';
import { searchApi, eventApi } from '../redux/services/apiService';
import { getLocationFromLocalStorage } from '../components/common/LocationDropdown';
import { getAnonymousId } from '../services/browsingHistory/anonymousId';

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [resultCount, setResultCount] = useState(0);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const location = getLocationFromLocalStorage();
        const response = await searchApi.search({
          q: query,
          lat: location?.latitude,
          lng: location?.longitude,
          anonId: getAnonymousId(),
          ...filters,
        });
        if (response.success) {
          setProducts(response.data.products || []);
          setResultCount(response.data.result_count || 0);
          setBrands(response.data.facets?.brands || []);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setProducts([]);
        setResultCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
    else { setProducts([]); setResultCount(0); setLoading(false); }
  }, [query, filters]);

  const handleCardClick = (position, product) => {
    eventApi.track({
      eventType: 'product_click',
      productId: product.product_id,
      categoryId: product.category_id?._id,
      source: 'search',
      searchQuery: query,
      position,
      anonId: getAnonymousId(),
    });
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="flex flex-1 px-2 gap-2">
        <ProductFilter
          categoryId={null}
          subcategories={[]}
          brands={brands}
          onFilterChange={setFilters}
        />

        {/* min-w-0: a flex child defaults to min-width:auto and refuses to
            shrink below its content, which is what let the product grid
            push this section (and the page) wider than the viewport. */}
        <section className="flex-1 min-w-0 flex flex-col">
          <h1 className="text-xl font-semibold mt-4 mb-1">
            {query ? `Search results for "${query}"` : 'Search'}
          </h1>
          {!loading && (
            <p className="text-sm text-gray-500 mb-4">
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mb-10">
            {loading ? (
              Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)
            ) : products.length > 0 ? (
              products.map((product, i) => (
                <ProductCard key={product._id} product={product} onCardClick={(p) => handleCardClick(i + 1, p)} />
              ))
            ) : query ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg mb-2">No products found for &quot;{query}&quot;</p>
                <p className="text-gray-400 text-sm">Try a different search term or browse categories instead.</p>
              </div>
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                Type something in the search bar above to get started.
              </div>
            )}
          </div>

          {!loading && <RecommendationRail context="search" searchQuery={query} />}
        </section>
      </div>
    </main>
  );
}
