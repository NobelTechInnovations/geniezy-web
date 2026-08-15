'use client';

import { useState, useEffect } from 'react';
import HorizontalCategoryList from '../../components/delivery/HorizontalCategoryList';
import HorizontalProductList from '../../components/delivery/HorizontalProductList';
import { categoryApi, eventApi } from '../../redux/services/apiService';
import { useSearchParams } from "next/navigation";
import { getLocationFromLocalStorage } from '../../components/common/LocationDropdown';
import { getAnonymousId } from '../../services/browsingHistory/anonymousId';

// Grocery Fresh root category — used whenever the page is opened without an
// explicit ?gc_id= (e.g. from the top nav "Grocery Fresh" link), so this
// vertical always has a real category to query instead of hitting
// /catalog/null/items.
const GROCERY_FRESH_CATEGORY_ID = '681cab9bd9abf241b6aa6d30';

export default function GroceryClient() {
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasOutOfRange, setHasOutOfRange] = useState(false);
  const [showAllDelivery, setShowAllDelivery] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const categoryId = searchParams.get("gc_id") || GROCERY_FRESH_CATEGORY_ID;
        const location = getLocationFromLocalStorage();

        const response = await categoryApi.getCategoryProducts(categoryId, {
          lat: location?.latitude,
          lng: location?.longitude,
          includeOutOfRange: showAllDelivery,
        });

        if (response.success) {
          setProducts(response.data.products || []);
          setHasOutOfRange(!!response.data.has_out_of_range_products);

          const transformedCategories =
            response.data.root_category_with_children?.children?.map(
              (cat) => ({
                id: cat._id,
                name: cat.name,
                slug: cat.slug,
                image:
                  cat.thumbnail ||
                  "https://via.placeholder.com/150",
              })
            ) || [];

          setCategories(transformedCategories);

          if (response.data.category) {
            eventApi.track({
              eventType: 'view_category',
              categoryId: response.data.category._id,
              anonId: getAnonymousId(),
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, showAllDelivery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <HorizontalCategoryList
        categories={categories}
        loading={loading}
      />

      {!loading && hasOutOfRange && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800 flex items-center justify-between gap-4">
          <span>
            {products.length === 0
              ? 'No sellers currently deliver this same-day to your location.'
              : 'More products are available outside your same-day delivery area.'}
          </span>
          <label className="flex items-center gap-2 whitespace-nowrap cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAllDelivery}
              onChange={(e) => setShowAllDelivery(e.target.checked)}
              className="accent-blue-600"
            />
            Show all (Standard Delivery)
          </label>
        </div>
      )}

      <HorizontalProductList
        products={products.map((product) => ({
          _id: product._id,
          name: product.title,
          type: product.type,
          sku: product.sku || product.unified_sku,
          gspin: product.product_id,
          price:
            product.price?.selling_price?.$numberDecimal || 0,
          image:
            product.images?.[0]?.thumbnail_image ||
            "https://via.placeholder.com/150",
          category_id: product.category_id,
          delivery_type: product.delivery_type,
        }))}
        loading={loading}
      />
    </div>
  );
}
