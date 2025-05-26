'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiHeart, FiShare2, FiShoppingCart, FiStar, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';

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
  }
];

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [exchange, setExchange] = useState('no');
  const [selectedPlans, setSelectedPlans] = useState([]);

  // For 9+ indicator
  const maxThumbs = 7;
  const thumbsToShow = productData.images.slice(0, maxThumbs);
  const extraThumbs = productData.images.length - maxThumbs;

  const handlePlanToggle = (idx) => {
    setSelectedPlans((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

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
          <div className="lg:col-span-5 flex flex-row gap-4 items-start min-h-[500px]">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 items-center lg:items-start min-w-[52px]">              
              {thumbsToShow.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-md overflow-hidden w-12 h-12 flex items-center justify-center bg-white transition-all ${selectedImage === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}
                >
                  <img
                    src={image}
                    alt={`Thumb ${index + 1}`}
                    className="object-contain w-full h-full"
                  />
                </button>
              ))}
              {extraThumbs > 0 && (
                <div className="border rounded-md w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 font-semibold text-sm">{`+${extraThumbs}`}</div>
              )}
            </div>
            {/* Main Image */}
            <div className="relative w-full flex-1 aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center min-w-[250px] max-w-[550px]">
              <img
                src={productData.images[selectedImage]}
                alt={productData.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Column 2: Product Info */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{productData.title}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-700 text-sm font-semibold cursor-pointer hover:underline">Visit the {productData.brand} Store</span>
              <span className="flex items-center text-yellow-500 font-semibold ml-2">
                <FiStar className="mr-1" /> {productData.rating}
              </span>
              <span className="text-gray-600 text-sm">({productData.ratingCount})</span>
              <span className="text-blue-700 text-xs font-medium ml-2 cursor-pointer hover:underline">Search this page</span>
            </div>
            <div className="text-xs text-gray-700 mb-2">{productData.boughtCount}</div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 font-bold text-xl">-{productData.discount}</span>
              <span className="text-2xl font-bold text-gray-900">₹{productData.price}</span>
              <span className="text-base text-gray-500 line-through">₹{productData.originalPrice}</span>
            </div>
            <div className="text-xs text-gray-700 mb-2">M.R.P.: <span className="line-through">₹{productData.originalPrice}</span></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 text-xs px-2 py-1 rounded font-semibold text-gray-700">a. Fulfilled</span>
              <span className="text-xs text-gray-700">Inclusive of all taxes</span>
            </div>
            <div className="text-xs text-gray-700 mb-2">EMI starts at ₹1,697. No Cost EMI available <span className="text-blue-700 cursor-pointer hover:underline">EMI options</span></div>
            {/* Offers as horizontal cards */}
            <div className="flex flex-wrap gap-2 mb-2">
              {productData.offers.map((offer, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs min-w-[140px] flex-1">
                  <div className="font-semibold text-gray-800 mb-1">{offer.title}</div>
                  <div className="text-gray-700 mb-1">{offer.desc}</div>
                  <Link href={offer.link} className="text-blue-700 hover:underline">{offer.title === 'Cashback' ? '2 offers' : offer.title === 'No Cost EMI' ? '1 offer' : '23 offers'}</Link>
                </div>
              ))}
            </div>
            {/* Icons row */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-700 mb-2 items-center">
              <div className="flex flex-col items-center"><FiRefreshCw className="text-lg mb-1" />7 days Service Centre Replacement</div>
              <div className="flex flex-col items-center"><FiTruck className="text-lg mb-1" />Free Delivery</div>
              <div className="flex flex-col items-center"><FiShield className="text-lg mb-1" />1 Year Warranty</div>
              <div className="flex flex-col items-center"><FiShoppingCart className="text-lg mb-1" />Cash/Pay on Delivery</div>
            </div>
          </div>

          {/* Column 3: Buy Box */}
          <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col gap-6 min-w-[260px] max-w-md mx-auto lg:mx-0">
            {/* Exchange radio */}
            <div className="flex flex-col gap-2 mb-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="radio" name="exchange" value="yes" checked={exchange === 'yes'} onChange={() => setExchange('yes')} />
                With Exchange <span className="text-red-600 font-semibold ml-1">Up to ₹ 32,500.00 off</span>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="radio" name="exchange" value="no" checked={exchange === 'no'} onChange={() => setExchange('no')} />
                Without Exchange <span className="text-gray-900 font-semibold ml-1">₹ {productData.price}.00</span> <span className="text-gray-500 line-through ml-1">₹ {productData.originalPrice}.00</span>
              </label>
            </div>
            {/* Delivery, stock, seller, payment, gift */}
            <div className="mb-2">
              <div className="text-xs text-blue-700 font-semibold cursor-pointer hover:underline">FREE delivery 29 - 31 May to Jaipur</div>
              <div className="text-green-600 font-semibold text-sm mb-1">In stock | In 90+ carts</div>
              <div className="text-xs text-gray-700">Ships from <span className="font-semibold">Amazon</span></div>
              <div className="text-xs text-gray-700">Sold by <span className="font-semibold">Renfe</span></div>
              <div className="text-xs text-blue-700 cursor-pointer hover:underline">Secure transaction</div>
              <div className="text-xs text-blue-700 cursor-pointer hover:underline">Gift options Available at checkout</div>
            </div>
            {/* Protection Plans (checkboxes) */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">Add a Protection Plan:</h3>
              <ul className="space-y-1">
                {productData.protectionPlans.map((plan, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                    <input type="checkbox" checked={selectedPlans.includes(idx)} onChange={() => handlePlanToggle(idx)} />
                    <span>{plan.name} for <span className="text-red-600 font-semibold">₹{plan.price}</span></span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Quantity & Actions */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-gray-700 font-medium mb-1">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 w-24 text-sm"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-base mt-2">
                <FiShoppingCart className="text-xl" />
                Add to Cart
              </button>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-base">
                Buy Now
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 justify-center mt-2">
                <FiHeart className="text-xl" />
                <span>Add to Wishlist</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 justify-center">
                <FiShare2 className="text-xl" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section (full width, below main grid) */}
      <div className="container mx-auto px-4 pb-12">
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
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </main>
  );
};

export default ProductPage;