import Image from "next/image";
import CategorySection from './components/home/CategorySection';
import HeroSection from './components/home/HeroSection';
import FestiveCategory from './components/home/FestiveCategory';
import MainSingleProductCard from './components/common/products/mainSingleProductCard';


export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section with slider and ads */}
      <div className="flex flex-col gap-4 mt-2">
        <HeroSection />
      </div>
      
      {/* Festive Categories Section */}
      <FestiveCategory />
      
      {/* Categories Section */}
      <CategorySection />

      {/* Main Product Card Section */}
      <MainSingleProductCard />
    </main>
  );
}
