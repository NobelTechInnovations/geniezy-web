'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';
import { productApi } from '@/app/redux/services/apiService';

const RecommendedProducts = ({ categoryId, itemId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!categoryId || !itemId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await productApi.getProductRecommendations(categoryId, itemId);
        
        if (response.success && Array.isArray(response.data)) {
          // Limit to 8 products as requested and ensure unique products
          const uniqueProducts = response.data.reduce((acc, product) => {
            // Create a unique key combining _id and sku
            const uniqueKey = `${product._id}-${product.sku}`;
            if (!acc.some(p => `${p._id}-${p.sku}` === uniqueKey)) {
              acc.push(product);
            }
            return acc;
          }, []).slice(0, 8);
          
          setProducts(uniqueProducts);
        } else {
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [categoryId, itemId]);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1280: {
            slidesPerView: 5,
          },
          1536: {
            slidesPerView: 6,
          },
        }}
        className="recommended-products-swiper"
      >
        {products.map((product) => (
          <SwiperSlide key={`${product._id}-${product.sku}`}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecommendedProducts; 