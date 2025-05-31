'use client';

import { useEffect, useState } from 'react';
import MainSingleProductCard from '../common/products/mainSingleProductCard';

const RecentViewProducts = () => {
  const [recentProducts, setRecentProducts] = useState([]);

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
              .slice(0, 8); // Get only the 8 most recent products
            
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
  console.log(recentProducts,'===recentProducts===');
  if (recentProducts.length === 0) {
    return null; // Don't render anything if there are no recent products
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Recently Viewed Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recentProducts.map((product) => (
          <MainSingleProductCard
            key={product.gspin}
            product={{
              gspin: product.gspin,
              name: product.productName,
              image: product.productImage,
              brand: product.brand,
              categoryId: product.categoryId,
              categoryName: product.categoryName
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentViewProducts; 