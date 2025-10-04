'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MAIN_CATEGORIES } from '@/app/shared/constants/categories';
import { categoryApi } from '@/app/redux/services/apiService';

const CategorySection = () => {
  const [subcategoriesMap, setSubcategoriesMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubcategories = async () => {
      setLoading(true);
      const newMap = {};
      for (const category of MAIN_CATEGORIES) {
        try {
          // Fetch child categories for each main category by id
          const response = await categoryApi.getChildCategories(category.id, 'v1');
          if (response.success && response.data) {
            newMap[category.id] = response.data.map((child) => child.name);
          } else {
            newMap[category.id] = [];
          }
        } catch (e) {
          newMap[category.id] = [];
        }
      }
      setSubcategoriesMap(newMap);
      setLoading(false);
    };
    fetchSubcategories();
  }, []);

  return (
    <section className="py-4">
      <div className="container mx-auto">
        <h2 className="text-xl font-bold mb-2 text-gray-900 text-left">
          Top Categories Of The Month
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MAIN_CATEGORIES.map((category) => (
            <div 
              key={category.id} 
              className="border border-gray-200 rounded-md overflow-hidden"
            >
              <div className="flex items-start">
                <div className="w-1/3 relative">
                  <div className="aspect-square relative">
                    <div className="w-full h-full flex items-center justify-center rounded">
                      {/* Using a fallback symbol if image fails */}
                        <img 
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        />
                    </div>
                  </div>
                </div>
                

                <div className="w-2/3 p-2">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    <Link href={`/gc/${category.slug}?gc_id=${category.id}`}>{category.name}</Link>
                  </h3>
                  <p className="text-gray-600 text-xs mb-2">
                    {category.description}
                  </p>
                  <a href={`/gc/${category.slug}?gc_id=${category.id}`} className="text-gray-600 hover:text-red-500 text-sm text-decoration-underline">Shop Now</a>
                  {/* <ul className="space-y-1.5">
                    {(subcategoriesMap[category.id] || []).map((subcat, index) => (
                      <li key={index}>
                        <Link 
                          href={`/gc/${category.slug}?gc_id=${category.id}`}
                          className="text-gray-600 hover:text-red-500 text-sm"
                        >
                          {subcat}
                        </Link>
                      </li>
                    ))}
                  </ul> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection; 