'use client';

import { useState } from 'react';
import Link from 'next/link';

import ProductGallerySection from '@/app/components/product-detail/ProductGallerySection';
import ProductInfoSection from '@/app/components/product-detail/ProductInfoSection';
import ProductCartSection from '@/app/components/product-detail/ProductCartSection';
import { useSearchParams } from 'next/navigation';


// Mock data for demonstration
const productData = {
  id: 1,
  title: "Samsung Galaxy S24 FE 5G AI Smartphone (Blue, 8GB RAM, 128GB Storage)",
  brand: "Samsung",
  storeLink: "#",
  price: "34,999",
  originalPrice: "49,999",
  discount: "30%",
  rating: 3.8,
  ratingCount: 83,
  boughtCount: "1K+ bought in past month",
  inStock: true,
  images: [
    "https://m.media-amazon.com/images/I/71ZKGDdz1lL._SL1500_.jpg",
    "https://images-cdn.ubuy.co.in/633aed8ec5c9d8743f5ad766-norcent-24-inch-720p-hd-led-smart-tv.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeWMJ9_2oWRVFvk0HTub0MxNPwRhOoBNwe4Q&s",
    "https://www.intex.in/cdn/shop/files/LED32201_PDP_1_1024x1024.jpg?v=1714032043",
  ],
  description: "2025's Best Selling Android Smartphone. Experience blazing fast 5G, AI-powered camera, and a stunning AMOLED display. Includes 1 year warranty and free delivery.",
  features: [
    "5G AI Processor",
    "AMOLED Display",
    "4500mAh Battery",
    "IP68 Water Resistant",
    "Android 14, One UI 6.0"
  ],
  specifications: {
    "Brand": "Samsung",
    "Model": "Galaxy S24 FE",
    "RAM": "8GB",
    "Storage": "128GB",
    "Color": "Blue",
    "Battery": "4500mAh",
    "Warranty": "1 Year"
  },
  offers: [
    { title: "Cashback", desc: "Upto ₹1,049.00 cashback as Amazon Pay Balance when you use select cards.", link: "#" },
    { title: "No Cost EMI", desc: "Upto ₹1,575.94 EMI interest savings on select cards.", link: "#" },
    { title: "Bank Offer", desc: "Upto ₹2,000.00 discount on select Credit Cards, HDFC, etc.", link: "#" }
  ],
  protectionPlans: [
    { name: "Total Protection Plan for 1 Year", price: "2,349.00" },
    { name: "Extended warranty for 1 Year", price: "1,549.00" },
    { name: "Screen Damage Protection for 1 year", price: "1,999.00" }
  ]
};

const recommendedProducts = [
  {
    id: 1,
    title: "Samsung Galaxy S23 FE 5G",
    price: "29,999",
    image: "https://m.media-amazon.com/images/I/71LJJrKbezL._SL1500_.jpg",
    link: "/products/samsung-s23-fe"
  },
  {
    id: 2,
    title: "OnePlus 12R 5G",
    price: "34,990",
    image: "https://m.media-amazon.com/images/I/71ZKGDdz1lL._SL1500_.jpg",
    link: "/products/oneplus-12r"
  },
  {
    id: 3,
    title: "iQOO Neo 9 Pro 5G",
    price: "32,999",
    image: "https://m.media-amazon.com/images/I/71S8qt+K8hL._SL1500_.jpg",
    link: "/products/iqoo-neo-9-pro"
  },
  {
    id: 4,
    title: "Realme 12 Pro+ 5G",
    price: "27,999",
    image: "https://m.media-amazon.com/images/I/71Nwtop9jtL._AC_SY175_.jpg",
    link: "/products/realme-12-pro-plus"
  },
  {
    id: 3,
    title: "iQOO Neo 9 Pro 5G",
    price: "32,999",
    image: "https://m.media-amazon.com/images/I/71S8qt+K8hL._SL1500_.jpg",
    link: "/products/iqoo-neo-9-pro"
  },
  {
    id: 4,
    title: "Realme 12 Pro+ 5G",
    price: "27,999",
    image: "https://m.media-amazon.com/images/I/71Nwtop9jtL._AC_SY175_.jpg",
    link: "/products/realme-12-pro-plus"
  }
];

const ProductPage = ({ params }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [exchange, setExchange] = useState('no');
  const [selectedPlans, setSelectedPlans] = useState([]);

  // product params
  const { gspin, slug } = params;
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const p_sku = searchParams.get('p_sku');
  const type = searchParams.get('type');

  // For 9+ indicator
  const maxThumbs = 7;
  const thumbsToShow = productData.images.slice(0, maxThumbs);
  const extraThumbs = productData.images.length - maxThumbs;

  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/gc/mobiles" className="text-gray-600 hover:text-blue-600">Mobiles & Accessories</Link>
          <span className="text-gray-400">/</span>
          <span className="text-blue-700 font-semibold">{productData.title}</span>
        </div>
      </div>

      {/* 3-Column Product Details Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Gallery (thumbnails + main image in a flex row, always parallel) */}
          <ProductGallerySection  
            thumbsToShow={thumbsToShow} 
            extraThumbs={extraThumbs} 
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            productData={productData}
          />

          {/* Column 2: Product Info */}
          <ProductInfoSection 
            productData={productData}
          />

          {/* Column 3: Buy Box */}
          
          <ProductCartSection  
            productData={productData}
            quantity={quantity}
            exchange={exchange}
            setQuantity={setQuantity}
            setExchange={setExchange}
          />

        </div>
      </div>

      {/* Product Details Section (full width, below main grid) */}
      <div className="container mx-auto px-4 pb-2">
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {Object.entries(productData.specifications).map(([key, value]) => (
              <div key={key} className="flex text-gray-700 text-base">
                <span className="font-semibold w-32">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-700 text-base mb-8">{productData.description}</p>
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="list-disc pl-6 text-gray-700 text-base space-y-1">
            {productData.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="container mx-auto px-4 pb-8">
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {recommendedProducts.map((product) => (
              <Link
                key={product.id}
                href={product.link}
                className="block group"
              >
                <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] mb-3 rounded-md overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600">
                      {product.title}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold">₹{product.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPage;