'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductGallerySection from '@/app/components/product-detail/ProductGallerySection';
import ProductInfoSection from '@/app/components/product-detail/ProductInfoSection';
import ProductCartSection from '@/app/components/product-detail/ProductCartSection';
import { productApi } from '@/app/redux/services/apiService';

const ProductPage = ({ params }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [exchange, setExchange] = useState('no');
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState(null);
  const [productImages, setProductImages] = useState([]);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const { productId, slug } = unwrappedParams;
  const gspin = productId;

  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const p_sku = searchParams.get('p_sku');
  const type = searchParams.get('type');

  // Fetch product images
  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await productApi.getProductImages(gspin, {
          pid,
          type,
          p_sku
        });
        if (response.success) {
          setProductImages(response.data);
          // Set initial selected image to primary image if available
          const primaryImageIndex = response.data.findIndex(img => img.is_primary);
          if (primaryImageIndex !== -1) {
            setSelectedImage(primaryImageIndex);
          }
        }
      } catch (error) {
        console.error('Error fetching product images:', error);
      }
    };

    if (gspin && pid) {
      fetchProductImages();
    }
  }, [gspin, pid, type, p_sku]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!gspin || !pid) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product data with params:', { gspin, pid, type, p_sku });

        const response = await productApi.getProductInfo(gspin, {
          pid,
          type,
          p_sku
        }, 'v1');

        console.log('API Response:', response);

        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch product data');
        }

        const data = response.data;
        if (!data) {
          throw new Error('No product data received');
        }

        // Transform API response to match UI requirements
        const transformedData = {
          id: data._id,
          title: data.title,
          brand: data.meta?.brand_details?.name || 'Generic',
          storeLink: "#",
          // Handle price, original price, and discount based on product type
          price: data.type === 'simple' ? 
            (data.price?.selling_price?.$numberDecimal || data.price?.selling_price) :
            (data.selected_combination?.price?.$numberDecimal || data.selected_combination?.price),
          originalPrice: data.type === 'simple' && (data.price?.mrp?.$numberDecimal || data.price?.mrp) ? 
            (data.price?.mrp?.$numberDecimal || data.price?.mrp) : 
            (data.type === 'variable' && (data.selected_combination?.price?.mrp?.$numberDecimal || data.selected_combination?.price?.mrp) ? 
              (data.selected_combination?.price?.mrp?.$numberDecimal || data.selected_combination?.price?.mrp) : 
              null),
          discount: data.type === 'simple' && (data.price?.mrp?.$numberDecimal || data.price?.mrp) && (data.price?.selling_price?.$numberDecimal || data.price?.selling_price) ? 
            Math.round((((data.price.mrp?.$numberDecimal || data.price.mrp) - (data.price.selling_price?.$numberDecimal || data.price.selling_price)) / (data.price.mrp?.$numberDecimal || data.price.mrp)) * 100) + '%' : 
            (data.type === 'variable' && (data.selected_combination?.price?.mrp?.$numberDecimal || data.selected_combination?.price?.mrp) && (data.selected_combination?.price?.selling_price?.$numberDecimal || data.selected_combination?.price?.selling_price) ?
              Math.round((((data.selected_combination.price.mrp?.$numberDecimal || data.selected_combination.price.mrp) - (data.selected_combination.price.selling_price?.$numberDecimal || data.selected_combination.price.selling_price)) / (data.selected_combination.price.mrp?.$numberDecimal || data.selected_combination.price.mrp)) * 100) + '%' :
              null),
          rating: 4.5, // These would come from a ratings API
          ratingCount: 83,
          boughtCount: "1K+ bought in past month",
          inStock: data.meta?.stock > 0,
          images: productImages.map(img => img.url) || [],
          description: data.description?.description || '',
          features: data.meta?.attributes?.map(attr => `${attr.name}: ${attr.value}`) || [],
          specifications: Object.fromEntries(
            data.meta?.attributes?.map(attr => [attr.name, attr.value]) || []
          ),
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

        console.log('Transformed data:', transformedData);
        setProductData(transformedData);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setError(error.message || 'Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [gspin, pid, type, p_sku, productImages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">Product not found</div>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

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
          {/* Column 1: Gallery */}
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

      {/* Product Details Section */}
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
    </main>
  );
};

export default ProductPage;