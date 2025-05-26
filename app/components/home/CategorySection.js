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
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Top Categories Of The Month
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MAIN_CATEGORIES.map((category) => (
            <div 
              key={category.id} 
              className="border border-gray-200 rounded-md overflow-hidden transition-transform hover:shadow-md p-4"
            >
              <div className="flex items-start">
                <div className="w-1/3 relative">
                  <div className="aspect-square relative">
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
                      {/* Using a fallback symbol if image fails */}
                        <img 
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        />
                    </div>
                  </div>
                </div>
                
                <div className="w-2/3 pl-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {category.name}
                  </h3>
                  <ul className="space-y-1.5">
                    {(subcategoriesMap[category.id] || []).map((subcat, index) => (
                      <li key={index}>
                        <Link 
                          href={`/category/${category.id}/${subcat.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-gray-600 hover:text-red-500 text-sm"
                        >
                          {subcat}
                        </Link>
                      </li>
                    ))}
                  </ul>
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