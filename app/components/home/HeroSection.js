'use client';

import Image from 'next/image';
import Link from 'next/link';

const banner = {
  id: 1,
  src: 'https://www.thedailymeal.com/img/gallery/how-to-pick-out-the-ripest-juciest-oranges-from-the-store/l-intro-1684280006.jpg',
  alt: 'Smart TV Banner',
  content: {
    title: 'Your local partner in natural and ethical food and groceries',
    subtitle: 'Discover the best of local produce and sustainable living. Shop with us and support your community.',
    discount: '30% OFF',
    buttonText: 'Shop Now'
  }
};

const HeroSection = () => {
  return (
    <section className="py-4 pb-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Centered 9 column grid */}
        <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-9 mx-auto gap-4">
          <div className="lg:col-span-9 relative rounded-lg overflow-hidden shadow-sm mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[400px] bg-[#ffe4bb]">
              
              {/* Left Side - Text */}
              <div className="flex items-center px-10 bg-white/70">
                <div className="max-w-lg py-auto">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {banner.content.brand}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    {banner.content.title}
                  </h2>
                  <p className="text-md mb-2 text-gray-700">
                    {banner.content.subtitle}
                  </p>
                  <div className="mb-3 text-sm text-gray-700">
                    {banner.content.countdown}
                  </div>
                  <Link
                    href="/products/smart-tv"
                    className="bg-gray-100 border border-gray-200 text-sm text-gray-700 px-4 py-2 rounded-md font-semibold transition-colors inline-block"
                  >
                    {banner.content.buttonText}
                  </Link>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="relative flex items-center justify-center">
                <img
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  className="w-full h-full object-cover "
                />
                
              </div>

            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
