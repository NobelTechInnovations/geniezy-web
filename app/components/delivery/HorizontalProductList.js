import React from 'react';
import S3Image from '@/app/shared/utils/S3Image';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
import { slugify } from '@/app/shared/utils/titleFormat';
import { formatIndianPrice } from '@/app/shared/utils/priceFormat';

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-start">
    <div className="w-full h-28 bg-gray-200 animate-pulse mb-2" />
    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-1" />
    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-1" />
    <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse mb-1" />
    <div className="flex items-center justify-between w-full mt-2">
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);


const ProductCard = ({ product }) => {
  const showDiscount = product.type === 'simple' && 
    product.price?.mrp && 
    product.price?.selling_price && 
    product.price.mrp > product.price.selling_price;

  const displayPrice = product.price?.selling_price || product.price?.mrp || product.price;

  return (
    <Link href={`/gspin/${product.gspin}/${slugify(product.name)}?pid=${product._id}&p_sku=${product.sku || product.unified_sku || ''}&type=${product.type}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-start w-[200px] min-w-[200px] max-w-[200px]">
        <div className="w-full h-28 flex items-center justify-center mb-2 overflow-hidden">
          <S3Image src={product.image} alt={product.name} className="h-24 object-contain " />
        </div>
        <div className="flex items-center text-xs bg-grey-700 text-gray-500 mb-1">
          <span className="mr-1">🕒</span> 9 MINS
        </div>
        <div className="font-medium text-sm mb-1 line-clamp-2 w-full">{product.name}</div>
        <div className="text-xs text-gray-500 mb-1 line-clamp-2 w-full">{product.details}</div>
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex flex-col">
            {showDiscount ? (
              <>
                <span className="font-semibold">{formatIndianPrice(product.price.selling_price)}</span>
                <span className="text-xs text-gray-500 line-through">{formatIndianPrice(product.price.mrp)}</span>
              </>
            ) : (
              <span className="font-semibold">{formatIndianPrice(displayPrice)}</span>
            )}
          </div>
          <button className="border border-green-600 text-green-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-green-50">ADD</button>
        </div>
      </div>
    </Link>
  );
};

const CategoryProductRow = ({ category, products, loading }) => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
          >
            <IoIosArrowBack className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
          >
            <IoIosArrowForward className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default function HorizontalProductList({ products, loading }) {
  // Group products by category
  const groupedProducts = React.useMemo(() => {
    if (!products) return {};

    return products.reduce((acc, product) => {
      const categorySlug = product.category_id?.slug || 'uncategorized';
      if (!acc[categorySlug]) {
        acc[categorySlug] = {
          name: product.category_id?.name || 'Uncategorized',
          products: []
        };
      }
      acc[categorySlug].products.push(product);
      return acc;
    }, {});
  }, [products]);

  return (
    <div className="space-y-8">
      {Object.entries(groupedProducts).map(([slug, { name, products }]) => (
        <CategoryProductRow
          key={slug}
          category={{ slug, name }}
          products={products}
          loading={loading}
        />
      ))}
    </div>
  );
} 