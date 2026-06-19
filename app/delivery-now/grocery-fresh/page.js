import { Suspense } from "react";
import GroceryClient from "./GroceryClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroceryClient />
    </Suspense>
  );
}



// 'use client';

// import { useState, useEffect } from 'react';
// import HorizontalCategoryList from '../../components/delivery/HorizontalCategoryList';
// import HorizontalProductList from '../../components/delivery/HorizontalProductList';
// import { categoryApi } from '../../redux/services/apiService';
// import { useSearchParams } from "next/navigation";

// export default function GroceryDeliveryPage() {
//   const searchParams = useSearchParams();
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const categoryId = searchParams.get("gc_id");

//         const response = await categoryApi.getCategoryProducts(categoryId);
//         if (response.success) {
//           setProducts(response.data.products || []);
//           const transformedCategories = response.data.root_category_with_children?.children?.map(cat => ({
//             id: cat._id,
//             name: cat.name,
//             slug: cat.slug,
//             image: cat.thumbnail || 'https://via.placeholder.com/150'
//           })) || [];
//           setCategories(transformedCategories);
//         }
//       } catch (error) {
//         console.error("Error fetching grocery data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [searchParams]);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <HorizontalCategoryList categories={categories} loading={loading} />
//       <HorizontalProductList 
//         products={products.map(product => ({
//           _id: product._id,
//           name: product.title,
//           type: product.type,
//           sku:product.sku || product.unified_sku,
//           gspin:product.product_id,
//           price: product.price?.selling_price?.$numberDecimal || 0,
//           image: product.images?.[0]?.thumbnail_image || 'https://via.placeholder.com/150',
//           category_id: product.category_id
//         }))} 
//         loading={loading}
//       />
//     </div>
//   );
// } 