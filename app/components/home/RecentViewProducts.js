'use client';

import { useEffect, useState, useRef } from 'react';
import MainSingleProductCard from '../common/products/mainSingleProductCard';

const RecentViewProducts = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        // Open IndexedDB with correct DB and store
        const request = indexedDB.open('browsingHistoryDB', 1);
        
        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
        };

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(['browsingHistory'], 'readonly');
          const store = transaction.objectStore('browsingHistory');
          
          // Get all records
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            // Filter only product type records and sort by timestamp
            const products = getAllRequest.result
              .filter(item => item.type === 'product')
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 12); // Max 12 products
            
            setRecentProducts(products);
          };
        };

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('browsingHistory')) {
            db.createObjectStore('browsingHistory', { keyPath: 'id', autoIncrement: true });
          }
        };
      } catch (error) {
        console.error('Error fetching recent products:', error);
      }
    };

    fetchRecentProducts();
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth / 2 : container.offsetWidth / 2;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (recentProducts.length === 0) {
    return null; // Don't render anything if there are no recent products
  }

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">Pick up where you left off: Get extra 30% off on your first order</h2>
          <span className='text-grey-500 text-sm'>Shop now your favorite products with extra 30% off</span>
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
        {recentProducts.map((product) => (
          <div key={product.gspin} className="flex-shrink-0 w-48 max-w-[200px] min-w-[180px]">
            <MainSingleProductCard
              product={{
                gspin: product.gspin,
                name: product.productName,
                image: product.productImage,
                brand: product.brand,
                categoryId: product.categoryId,
                sku: product.sku,
                product_type: product.product_type,
                categoryName: product.categoryName
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentViewProducts; 