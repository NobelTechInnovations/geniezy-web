'use client';

import HorizontalCategoryList from '../../components/delivery/HorizontalCategoryList';
import HorizontalProductList from '../../components/delivery/HorizontalProductList';


const groceryCategories = [
    { id: 1, name: 'Dairy, Bread & Eggs', image: 'https://png.pngtree.com/png-clipart/20240418/original/pngtree-fresh-bread-and-milk-isolated-on-white-background-png-image_14885236.png' },
    { id: 2, name: 'Fruits & Vegetables', image: 'https://img.freepik.com/free-psd/vibrant-vegetable-harvest-colorful-collection-fresh-produce_191095-79960.jpg?semt=ais_hybrid&w=740' },
    { id: 3, name: 'Cold Drinks & Juices', image: 'https://wallpapers.com/images/hd/assorted-soft-drinks-collection-0bssdibxr7paa77c.png' },
    { id: 4, name: 'Snacks & Munchies', image: 'https://americancandyuk.co.uk/cdn/shop/products/white-munchies-flamin-hot-flavored-snack-mix.png?v=1678230714' },
    { id: 5, name: 'Breakfast & Instant Food', image: 'https://www.mtrfoods.com/mtr_admin/data_content/products_category/background_img/3-mins-bf-packshot-1.png' },
    { id: 6, name: 'Sweet Tooth', image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_272,w_252/NI_CATALOG/IMAGES/CIW/2025/5/14/be495106-1b99-4432-92cc-a3b5c3f50340_9768_1.png' },
    { id: 7, name: 'Bakery & Biscuits', image: 'https://www.pikpng.com/pngl/b/73-732764_download-cookies-png-images-background-bakery-biscuits-images.png' },
    { id: 8, name: 'Tea, Coffee & Health Drink', image: 'https://www.ippobuy.com/cdn/shop/collections/400x400_e75f9365-8d18-4a45-a21e-58c8c6b26e20.png?v=1684152560' },
    { id: 9, name: 'Atta, Rice & Dal', image: 'https://storage.googleapis.com/shy-pub/49210/1626252512397_Screenshot_20210714-140219.png' },
    { id: 10, name: 'Masala, Oil & More', image: 'https://catchfoods.com/wp-content/uploads/2025/03/Kitchen-King.png' },
    { id: 11, name: 'Sauces & Spreads', image: 'https://static.vecteezy.com/system/resources/previews/047/830/721/non_2x/assorted-creamy-sauces-in-white-bowls-with-parsley-garnish-in-the-background-perfect-for-culinary-and-food-related-themes-png.png' },
    { id: 12, name: 'Chicken, Meat & Fish', image: 'https://www.kindpng.com/picc/m/139-1392807_fresh-chicken-fish-meat-hd-png-download.png' },
    { id: 13, name: 'Organic & Healthy Living', image: 'https://www.patanjaliayurved.net/assets/product_images/400x500/1708335712oats500g1.png' },
    { id: 14, name: 'Baby Care', image: 'https://allibhavan.com/cdn/shop/collections/baby-care-501339.jpg?v=1720087731' },
    { id: 15, name: 'Pharma & Wellness', image: 'https://themedihubpharma.in/wp-content/uploads/2024/05/Himalaya-Brahmi-Tablets-Mind-Wellness-Improve-Alertness-Tablet.png' },
    { id: 16, name: 'Cleaning Essentials', image: 'https://ciigreenpro.com/uploads/products/1706972324Mixed1-copy.jpg?v=20201209' },
    { id: 17, name: 'Home & Office', image: 'https://png.pngtree.com/png-clipart/20231116/original/pngtree-set-of-stationery-items-office-photo-png-image_13576125.png' },
    { id: 18, name: 'Personal Care', image: 'https://www.pngitem.com/pimgs/m/160-1608077_product-png-transparent-png.png' },
    { id: 19, name: 'Pet Care', image: 'https://www.pedigree.in/files/styles/webp/public/2023-12/landing-hero-adult-smallBreed.png.webp?VersionId=Yv4sBw5yQusTd0B8fdwsHS_xeE0hB.mp&itok=zs8lLyvP' },
  ];
  
  const groceryProducts = [
    { id: 1, name: 'Saras Toned Milk', details: '500 ml', price: 26, image: 'https://images.bhaskarassets.com/thumb/1200x900/web2images/521/2024/07/30/dn77716937v-v24306_manual.jpg' },
    { id: 2, name: 'Amul Taaza Toned Milk', details: '500 ml', price: 27, image: 'https://www.bigbasket.com/media/uploads/p/l/40239253_1-amul-taaza-toned-milk-pasteurised-pure-fresh-no-preservatives.jpg' },
    { id: 3, name: 'Saras Curd', details: '200 g', price: 16, image: 'https://static.wixstatic.com/media/73e2bc_6b8b482c856d47e7915a85a891dcbbb1~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg' },
    { id: 4, name: 'Saras Gold Full Cream Milk', details: '500 ml', price: 33, image: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/salte66pbsjajsd8vn4l' },
    { id: 5, name: 'Amul Salted Butter', details: '100 g', price: 60, image: 'https://m.media-amazon.com/images/I/61vr7r8qqsL._AC_UF894,1000_QL80_.jpg' },
    { id: 6, name: 'Harvest Gold Hearty Brown Bread', details: '400 g', price: 55, image: 'https://harvestgold.in/image/ProductImage/61e7a205cb4acd391f51b43767f53c21.png' },
    { id: 7, name: 'Amul Gold Milk', details: '500 ml', price: 34, image: 'https://i.pinimg.com/736x/da/56/38/da56387a5d49a26344b810ff18dfe5e8.jpg' },
    { id: 8, name: 'Amul Salted Butter', details: '100 g', price: 60, image: 'https://m.media-amazon.com/images/I/61vr7r8qqsL._AC_UF894,1000_QL80_.jpg' },
  ];

export default function GroceryDeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HorizontalCategoryList categories={groceryCategories} />
      <HorizontalProductList title="Atta, Rice & Dal" products={groceryProducts} onSeeAll={() => {}} />
    </div>
  );
} 