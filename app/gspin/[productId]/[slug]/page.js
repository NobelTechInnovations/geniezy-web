'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ProductGallerySection from '@/app/components/product-detail/ProductGallerySection';
import ProductInfoSection from '@/app/components/product-detail/ProductInfoSection';
import ProductCartSection from '@/app/components/product-detail/ProductCartSection';
import { productApi } from '@/app/redux/services/apiService';
import { getLocationFromLocalStorage } from '@/app/components/common/LocationDropdown';
import useDistanceMatrix from '@/app/hooks/useDistanceMatrix';

const ProductPage = ({ params }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [exchange, setExchange] = useState('no');
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const { productId, slug } = unwrappedParams;
  const gspin = productId;

  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const p_sku = searchParams.get('p_sku');
  const type = searchParams.get('type');

  // Get user location from local storage
  const userLocation = getLocationFromLocalStorage();

  // Use the distance matrix hook
  const { duration, loading: distanceLoading, error: distanceError } = useDistanceMatrix(
    userLocation,
    productData?.seller?.location ? {
      latitude: productData.seller.location[1],
      longitude: productData.seller.location[0]
    } : null
  );

  // Reset data loaded flag when product params change
  useEffect(() => {
    setIsDataLoaded(false);
    setProductData(null); // Clear previous data
    setProductImages([]); // Clear previous images
    setSelectedImage(0); // Reset selected image
  }, [gspin, pid, type, p_sku]); // Reset when product identifiers change

  // Effect to fetch product data and images
  useEffect(() => {
    const fetchDataAndImages = async () => {
      if (!gspin || !pid) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      // Only fetch if data is not already loaded for this product
      if (isDataLoaded) {
        return; // Data already loaded, no need to refetch unless product params change
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch product data
        console.log('Fetching product data with params:', { gspin, pid, type, p_sku });
        const dataResponse = await productApi.getProductInfo(gspin, {
          pid,
          type,
          p_sku
        }, 'v1');
        console.log('Product data API Response:', dataResponse);

        if (!dataResponse.success) {
          throw new Error(dataResponse.message || 'Failed to fetch product data');
        }

        const data = dataResponse.data;
        if (!data) {
          throw new Error('No product data received');
        }

        // Fetch product images
        console.log('Fetching product images with params:', { gspin, pid, type, p_sku });
        const imagesResponse = await productApi.getProductImages(gspin, {
          pid,
          type,
          p_sku
        });
        console.log('Product images API Response:', imagesResponse);

        let images = [];
        let initialSelectedImageIndex = 0;

        if (imagesResponse.success && imagesResponse.data) {
            images = imagesResponse.data.map(img => img.url) || [];
             // Find and set initial selected image to primary image if available
            const primaryImageIndex = imagesResponse.data.findIndex(img => img.is_primary);
            if (primaryImageIndex !== -1 && images[primaryImageIndex]) { // Also check if image exists at that index
                initialSelectedImageIndex = primaryImageIndex;
            } else if (images.length > 0) {
                initialSelectedImageIndex = 0;
            } else {
                initialSelectedImageIndex = 0;
            }
        }

        // Transform API response to match UI requirements
        const transformedData = {
          id: data._id,
          title: data.title,
          category: data.category_id || '',
          brand: data.meta?.brand_details?.name || 'Generic',
          storeLink: "#",
          // Handle price, original price, and discount based on product type
          price: data.type === 'simple' ?
            (data.price?.selling_price?.$numberDecimal || data.price?.selling_price) : // Check for $numberDecimal or direct value
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
          images: images,
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
          ],
          seller: {
              businessName: data.seller?.business?.business_name || 'N/A',
              location: data.seller?.business?.location?.coordinates || null,
              businessAddress: data.seller?.business?.pincode +' '+ data.seller?.business?.business_address || 'N/A'
          }
        };

        // Update states once data is processed
        setProductData(transformedData);
        setProductImages(images);
        setSelectedImage(initialSelectedImageIndex); // Set selected image here after images are set

        // Set the flag to true after successful data load
        setIsDataLoaded(true);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load product data');
        setProductData(null); // Clear data on error
        setProductImages([]); // Clear images on error
        setIsDataLoaded(false); // Reset flag on error
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndImages();

  }, [gspin, pid, type, p_sku]); // Dependencies: re-run when product params change

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
          <Link href="/gc/mobiles" className="text-gray-600 hover:text-blue-600">{category.name}</Link>
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
            estimatedDelivery={duration?.text || 'Delivery time N/A'}
          />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="container mx-auto px-4 pb-2">
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Specifications</h2>
          {/* Specifications in a minimal table format */}
          <div className="mb-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-700 whitespace-nowrap w-1/3 lg:w-1/4">{key}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          {/* Product Description with HTML content */}
          <div className="text-gray-700 text-base mb-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: productData.description }}></div>

        </div>
      </div>
    </main>
  );
};

export default ProductPage;