'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sliderImages = [
  {
    id: 1,
    src: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/revslider/home_electric/s1-1.jpg',
    alt: 'Smart TV Banner',
    content: {
      brand: 'SAMSUNG',
      title: 'SMART TV 43 INCH',
      subtitle: '43M5500, 4K VFULL HD TIZEN OS',
      discount: '30% OFF',
      countdown: 'Only 2 days: 21/10 & 22/10',
      buttonText: 'Shop Now'
    }
  }
];

const bannerImages = [
  {
    id: 1,
    src: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2018/03/bn12.jpg',
    alt: 'Speaker Banner',
    content: {
      brand: 'Fluence',
      title: 'Minimal Speaker',
      price: '$159.99',
      priceLabel: 'Price Just'
    },
    link: '/products/speakers'
  },
  {
    id: 2,
    src: 'https://wpmartfury.com/marketplace6/wp-content/uploads/sites/7/2018/03/bn13.jpg',
    alt: 'GoPro Banner',
    content: {
      brand: 'GOPRO',
      title: 'GOPRO CAMERA',
      subtitle: 'SALE',
      discount: '20% OFF',
      countdown: 'Only 2 days: 21/10 & 2/10'
    },
    link: '/products/cameras'
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-4 pb-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Main layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Slider - 9 columns on large screens */}
          <div className="lg:col-span-9 relative rounded-lg overflow-hidden shadow-sm">
            <div className="relative w-full" style={{ height: '400px' }}>
              {sliderImages.map((image, index) => (
                <div 
                  key={image.id}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-lg ml-10">
                      <div className="text-sm font-medium text-gray-700 mb-2">{image.content.brand}</div>
                      <h2 className="text-4xl font-bold text-gray-700 mb-2 drop-shadow-md">
                        {image.content.title}
                      </h2>
                      <p className="text-xl  mb-2 drop-shadow-md text-gray-700">
                        {image.content.subtitle}
                      </p>
                      <div className="mb-3 text-sm text-gray-700">
                        {image.content.countdown}
                      </div>
                      <Link href="/products/smart-tv" className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold transition-colors inline-block">
                        {image.content.buttonText}
                      </Link>
                    </div>
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <div className="bg-red-500 text-white w-32 h-32 rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{image.content.discount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Slider navigation dots */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {sliderImages.map((_, index) => (
                  <button 
                    key={index}
                    className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-red-500' : 'bg-white bg-opacity-50'}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Banners - 3 columns stacked on large screens */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4">
            {bannerImages.map((banner) => (
              <Link href={banner.link} key={banner.id} className="block relative rounded-lg overflow-hidden shadow-sm">
                <div style={{ height: '190px' }} className="relative">
                  <img
                    src={banner.src}
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 p-4 flex flex-col justify-center">
                    {banner.content.brand && (
                      <div className="text-sm font-medium text-gray-800">{banner.content.brand}</div>
                    )}
                    {banner.content.title && (
                      <h3 className="text-xl font-bold text-gray-900">{banner.content.title}</h3>
                    )}
                    {banner.content.subtitle && (
                      <div className="text-lg font-bold text-gray-900">{banner.content.subtitle}</div>
                    )}
                    {banner.content.price && (
                      <>
                        <div className="text-xs text-gray-700 mt-1">{banner.content.priceLabel}</div>
                        <div className="text-lg font-bold text-green-600">{banner.content.price}</div>
                      </>
                    )}
                    {banner.content.discount && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center">
                          <div className="text-sm font-bold">{banner.content.discount}</div>
                        </div>
                      </div>
                    )}
                    {banner.content.countdown && (
                      <div className="text-xs text-gray-700 mt-1">{banner.content.countdown}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection; 