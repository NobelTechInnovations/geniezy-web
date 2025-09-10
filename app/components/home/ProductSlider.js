'use client';

import { useEffect, useState, useRef } from 'react';
import MainSingleProductCard from '../common/products/mainSingleProductCard';
import { categoryApi } from "../../redux/services/apiService";
import ProductCardSkeleton from '../common/products/ProductCardSkeleton';
import ProductCard from '../common/products/ProductCard';

export default function ProductSlider({ gc_id, title, tagline }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getCategoryProducts(gc_id);

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
  }, [gc_id]);

console.log(products);
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
                className="flex overflow-x-auto gap-4 scrollbar-hide-mx-4"
                style={{scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch'}}
            >
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mb-10">
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

            </div>
            
        </div>
   </>
  );
}
