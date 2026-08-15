'use client';

import { useEffect, useState, useRef } from 'react';
import MainSingleProductCard from '../common/products/mainSingleProductCard';
import { categoryApi } from "../../redux/services/apiService";
import ProductCardSkeleton from '../common/products/ProductCardSkeleton';
import ProductCard from '../common/products/ProductCard';
import { getLocationFromLocalStorage } from '../common/LocationDropdown';

// Two modes: pass `gc_id` and it fetches that category's products itself
// (original behavior); or pass pre-fetched `products`/`externalLoading`
// (used by the dynamic home feed, which already fetched everything in one
// call) and the internal fetch is skipped entirely. Same visual output
// either way — only the data source changes.
export default function ProductSlider({ gc_id, title, tagline, products: externalProducts, externalLoading }) {
  const usesExternalData = externalProducts !== undefined;
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (usesExternalData) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const location = getLocationFromLocalStorage();
        const response = await categoryApi.getCategoryProducts(gc_id, {
          lat: location?.latitude,
          lng: location?.longitude,
        });

        if (response.success) {
          setProducts(response.data.products || []);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (gc_id) {
      fetchData();
    }
  }, [gc_id, usesExternalData]);

  const displayProducts = usesExternalData ? externalProducts : products;
  const displayLoading = usesExternalData ? externalLoading : loading;

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth / 2 : container.offsetWidth / 2;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
   <>
        <div className="container mx-auto ">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <span className='text-grey-500 text-sm'>{tagline}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => scroll('left')}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Scroll left"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => scroll('right')}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Scroll right"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
            </div>
            <div
                ref={scrollContainerRef}
                className="flex gap-3 overflow-x-auto pb-2"
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch'}}
            >
                    {displayLoading ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="flex-none w-48 sm:w-48">
                          <ProductCardSkeleton />
                        </div>
                      ))
                    ) : (
                      displayProducts.map((product) => (
                        <div key={product._id} className="flex-none w-48 sm:w-48">
                          <ProductCard product={product} />
                        </div>
                      ))
                    )}
            </div>
            
        </div>
   </>
  );
}
