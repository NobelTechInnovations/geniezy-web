'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const categories = [
  {
    id: 1,
    name: 'Tv Televisions',
    image: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2022/12/39a-300x300.jpg',
    subcategories: [
      'Smart TV',
      '4K Ultra HD TVs',
      'LED TVs',
      'OLED TVs',
      'Accessories'
    ]
  },
  {
    id: 2,
    name: 'Air Conditioners',
    image: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2022/12/air-conditioners-168x168.jpg',
    subcategories: [
      'Type Hanging On Wall',
      'Type Erect',
      'Type Hanging On Ceiling',
      'Accessories'
    ]
  },
  {
    id: 3,
    name: 'Washing Machine',
    image: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2013/06/20a-168x168.jpg',
    subcategories: [
      'Type Horizontal',
      'Type Vertical',
      'Type Drying Clothes'
    ]
  },
  {
    id: 4,
    name: 'Audios & Theaters',
    image: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2013/06/21a-168x168.jpg',
    subcategories: [
      'Speakers',
      'Home Theater System',
      'Wireless Audio',
      'Headphone',
      'Accessories'
    ]
  },
  {
    id: 5,
    name: 'Office Electronics',
    image: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2022/12/office-electronics-268x268.jpg',
    subcategories: [
      'Printers',
      'Store & Business',
      'Scanners',
      'Projectors',
      'Phones'
    ]
  },
  {
    id: 6,
    name: 'Car Electronics',
    image: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2022/12/44a-168x168.jpg',
    subcategories: [
      'Audio & Video',
      'Radar Detector',
      'Car Security Products',
      'Vehicle GPS Tracking',
      'Portable CB Radios'
    ]
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Top Categories Of The Month
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
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
                    {category.subcategories.map((subcat, index) => (
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