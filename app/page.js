import Image from "next/image";
import CategorySection from './components/home/CategorySection';
import HeroSection from './components/home/HeroSection';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      {/* Hero Section with slider and ads */}
      <div className="flex flex-col gap-4 mt-2">
        <HeroSection />
      </div>
      
      {/* Categories Section */}
      <CategorySection />
    </main>
  );
}
