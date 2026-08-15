'use client';

import { useEffect, useState } from 'react';
import CategorySection from './components/home/CategorySection';
import HeroSection from './components/home/HeroSection';
import FestiveCategory from './components/home/FestiveCategory';

import RecentViewProducts from './components/home/RecentViewProducts';
import ProductSlider from "./components/home/ProductSlider";
import RecommendationRail from './components/common/RecommendationRail';
import { homeFeedApi } from './redux/services/apiService';
import { getLocationFromLocalStorage } from './components/common/LocationDropdown';
import { getAnonymousId } from './services/browsingHistory/anonymousId';

const DEFAULT_TAGLINE = 'Shop now your favorite products with extra 60% off';

// Cold-start placeholders shown only until the first /home-feed response
// arrives (or if it comes back empty) — same look as the old hardcoded
// sliders, just not left on screen once real sections are known.
const FALLBACK_TITLE = 'Handpicked for you';

export default function Home() {
  const [sections, setSections] = useState(null); // null = not fetched yet
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const location = getLocationFromLocalStorage();
        const response = await homeFeedApi.getFeed({
          lat: location?.latitude,
          lng: location?.longitude,
          anonId: getAnonymousId(),
        });
        if (response.success) {
          setSections(response.data.sections || []);
        }
      } catch (error) {
        console.error('Error fetching home feed:', error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Same 4 ProductSlider slots the page always had, interleaved with the
  // same static sections in the same order — only each slot's title/products
  // now come from the dynamic home feed instead of being hardcoded.
  const slot = (index) => {
    const section = sections?.[index];
    if (!loading && sections && !section) return null; // fewer real sections than slots — skip, don't repeat old data
    return (
      <ProductSlider
        title={section?.title || FALLBACK_TITLE}
        tagline={DEFAULT_TAGLINE}
        products={section?.products || []}
        externalLoading={loading}
      />
    );
  };

  return (

    <main className="flex flex-col min-h-screen bg-white">

      {/* Hero Section with slider and ads */}
      <div className="flex flex-col gap-4 mt-2">
        <HeroSection />
      </div>

      <div className="container mx-auto px-3">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-8">
          {/* Main Product Card Section */}
          {slot(0)}
          {/* Festive Categories Section */}
          <FestiveCategory />
          {slot(1)}

          {slot(2)}
          {/* Categories Section */}
          <CategorySection />

          {slot(3)}
          {/* Behavior-driven recommendations (Phase 4, M3) — separate from
              the category-affinity sections above; blends product-level
              affinity + trending, graduated by confidence tier. */}
          <RecommendationRail context="home" />
          <RecentViewProducts />
        </div>
      </div>

    </main>
  );
}
