import Image from "next/image";
import CategorySection from './components/home/CategorySection';
import HeroSection from './components/home/HeroSection';
import FestiveCategory from './components/home/FestiveCategory';

import RecentViewProducts from './components/home/RecentViewProducts';
import ProductSlider from "./components/home/ProductSlider";

export default function Home() {
  return (

    <main className="flex flex-col min-h-screen bg-white">

      {/* Hero Section with slider and ads */}
      <div className="flex flex-col gap-4 mt-2">
        <HeroSection />
      </div>
      
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Main Product Card Section */}
          <ProductSlider categorySlug="mobiles-smartphones" gc_id="6824b40d4253af37c415fd9f" tagline="Shop now your favorite products with extra 60% off"title="Get special discounts on every newly launched smartphone." />
          {/* Festive Categories Section */}
          <FestiveCategory />
          <ProductSlider categorySlug="grocery-fresh" gc_id="681cab9bd9abf241b6aa6d30" tagline="Shop now your favorite products with extra 60% off"title="Get fresh groceries delivered to your doorstep in under 15 minutes — completely free!" />
          
          <ProductSlider categorySlug="mobiles-smartphones" gc_id="6824b40d4253af37c415fd9f" tagline="Shop now your favorite products with extra 60% off"title="Get special discounts on every newly launched smartphone." />
          {/* Categories Section */}
          <CategorySection />

          <ProductSlider categorySlug="mobiles-smartphones" gc_id="6824b40d4253af37c415fd9f" tagline="Shop now your favorite products with extra 60% off"title="Get special discounts on every newly launched smartphone." />
          <RecentViewProducts />
        </div>
      </div>  

    </main>
  );
}
