'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

const categoryData = [
  {
    id: 1,
    name: 'Top Deals',
    image: 'https://drfuri-demo-images.s3.us-west-1.amazonaws.com/martfury/christmas/home-christmas-img-box-1.png',
    link: '/category/top-deals'
  },
  {
    id: 2,
    name: 'Clearance',
    image: 'https://drfuri-demo-images.s3.us-west-1.amazonaws.com/martfury/christmas/home-christmas-img-box-2.png',
    link: '/category/clearance'
  },
  {
    id: 3,
    name: 'Christmas Store',
    image: 'https://drfuri-demo-images.s3.us-west-1.amazonaws.com/martfury/christmas/home-christmas-img-box-3.png',
    link: '/category/christmas-store'
  },
  {
    id: 4,
    name: 'Fall Thanksgiving',
    image: 'https://drfuri-demo-images.s3.us-west-1.amazonaws.com/martfury/christmas/home-christmas-img-box-4.png',
    link: '/category/fall-thanksgiving'
  },
  {
    id: 5,
    name: 'Stationery',
    image: 'https://drfuri-demo-images.s3.us-west-1.amazonaws.com/martfury/christmas/home-christmas-img-box-5.png',
    link: '/category/stationery'
  },
  {
    id: 6,
    name: 'Home & Gift',
    image: 'https://drfuri-demo-images.s3.us-west-1.amazonaws.com/martfury/christmas/home-christmas-img-box-6.png',
    link: '/category/home-gift'
  }
];

const FestiveCategory = () => {
  const scrollContainerRef = useRef(null);
  
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth / 2 : container.offsetWidth / 2;
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse By Categories</h2>
          <div className="flex items-center">
            <Link href="/categories" className="hidden md:flex items-center text-gray-600 hover:text-red-500 text-sm font-medium">
              SEE ALL CATEGORIES
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
            <div className="flex gap-2 md:ml-4">
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
        </div>

        {/* Mobile scrollable view */}
        <div className="md:hidden">
          <div 
            ref={scrollContainerRef} 
            className="flex overflow-x-auto gap-4 scrollbar-hide -mx-4 px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categoryData.map((category) => (
              <Link 
                key={category.id} 
                href={category.link}
                className="flex-shrink-0 block group"
              >
                <div className="w-44 overflow-hidden">
                  <div className="rounded-lg w-44 h-44 overflow-hidden mb-3 border border-gray-100 shadow-sm">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-800 text-sm">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop grid view */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categoryData.map((category) => (
            <Link 
              key={category.id} 
              href={category.link}
              className="block group"
            >
              <div className="overflow-hidden">
                <div className="rounded-lg overflow-hidden w-full aspect-square mb-3 border border-gray-100 shadow-sm">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-800 text-md">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestiveCategory; 