'use client';

import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';

const productsData = [
  {
    id: 1,
    title: "Buy Real Activ 100% Orange Juice",
    price: "990",
    image: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2025/7/19/c891f768-7a9c-4c12-b057-74143fd832ad_8589_2.png",
    link: "/products/lg-tv"
  },
  {
    id: 2,
    title: "Tshirt for Men Cotton Plain Polo T",
    price: "8,990",
    image: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/65140169313591ec220ab069/mens-t-shirts-with-collar_maroon_s-640x640.jpg",
    link: "/products/tcl-tv"
  },
  {
    id: 3,
    title: "Samsung 163 cm (65 inches) Neo QLED 4K Smart TV",
    price: "1,990",
    image: "https://5.imimg.com/data5/SELLER/Default/2023/1/PG/ZL/CZ/103876682/ladies-t-shirts-500x500.jpg",
    link: "/products/samsung-tv"
  },
  {
    id: 4,
    title: "Samsung 163 cm (65 inches) Crystal iSmart 4K TV",
    price: "2,990",
    image: "https://apps.factori.com/uploads/varientImages/2025-02-13-GuXo6Hbi2dpWVx0m5n7g4J9De.webp",
    link: "/products/samsung-crystal-tv"
  },
  {
    id: 5,
    title: "Samsung 163 cm (65 inches) Neo QLED 4K Smart TV",
    price: "1,11,990",
    image: "https://m.media-amazon.com/images/I/71LJJrKbezL._SL1500_.jpg",
    link: "/products/samsung-tv"
  },
  {
    id: 6,
    title: "Samsung 163 cm (65 inches) Crystal iSmart 4K TV",
    price: "890",
    image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/21807306/2025/2/18/71056cca-6ace-43ae-94b7-d417df43e2d61739881613440-The-Souled-Store-Solids-Smoke-Grey-Oversized-T-Shirts-817173-1.jpg",
    link: "/products/samsung-crystal-tv"
  },
  {
    id: 7,
    title: "Samsung 163 cm (65 inches) Neo QLED 4K Smart TV",
    price: "1,11,990",
    image: "https://m.media-amazon.com/images/I/71LJJrKbezL._SL1500_.jpg",
    link: "/products/samsung-tv"
  },
  
];

const MainSingleProductCard = () => {
  return (
    <section className="py-2 bg-white mb-2">
      <div className="container mx-auto">
        <div className="mb-2">
          <h2 className="text-xl font-bold">Pick up where you left off: Get extra 30% off on your first order</h2>
          <span className='text-grey-500 text-sm'>Shop now your favorite products with extra 30% off</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          {productsData.map((product) => (
            <Link 
              key={product.id}
              href={product.link}
              className="block group"
            >
              <div className="bg-white rounded-lg p-1  transition-shadow">
                <div className="relative aspect-[4/3] mb-3 border border-gray-200 p-1 rounded-md overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                   <button
                    className="absolute bottom-2 right-2 text-black p-1.5 rounded-full shadow-md hover:bg-g-600"
                    onClick={(e) => {
                      e.preventDefault(); // prevent link navigation
                      alert(`Added "${product.title}" to cart!`);
                    }}
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-md font-semibold">₹{product.price}</span>
                  </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Free delivery</span>

                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MainSingleProductCard; 