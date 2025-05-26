'use client';

import Link from 'next/link';

const productsData = [
  {
    id: 1,
    title: "LG 139 cm (55 inches) 4K Ultra HD Smart LED TV",
    price: "1,09,990",
    image: "https://m.media-amazon.com/images/I/71ZKGDdz1lL._SL1500_.jpg",
    link: "/products/lg-tv"
  },
  {
    id: 2,
    title: "TCL 164 cm (65 inches) 4K Ultra HD Smart QLED TV",
    price: "58,990",
    image: "https://m.media-amazon.com/images/W/MEDIAX_1215821-T1/images/I/71Nwtop9jtL._AC_SY175_.jpg",
    link: "/products/tcl-tv"
  },
  {
    id: 3,
    title: "Samsung 163 cm (65 inches) Neo QLED 4K Smart TV",
    price: "1,11,990",
    image: "https://m.media-amazon.com/images/I/71LJJrKbezL._SL1500_.jpg",
    link: "/products/samsung-tv"
  },
  {
    id: 4,
    title: "Samsung 163 cm (65 inches) Crystal iSmart 4K TV",
    price: "1,41,990",
    image: "https://m.media-amazon.com/images/I/71S8qt+K8hL._SL1500_.jpg",
    link: "/products/samsung-crystal-tv"
  }
];

const MainSingleProductCard = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Pick up where you left off</h2>
        <span className='text-grey-500 text-sm'>Sponsored</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productsData.map((product) => (
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
    </section>
  );
};

export default MainSingleProductCard; 