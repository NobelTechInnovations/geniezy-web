'use client';

import React from 'react';
import PageContainer from '@/components/layouts/PageContainer';
import HomeDefaultBanner from '@/components/partials/homepage/home-default/HomeDefaultBanner';
import SiteFeatures from '@/components/partials/homepage/autopart/SiteFeatures';
import HomeDefaultDealOfDay from '@/components/partials/homepage/home-default/HomeDefaultDealOfDay';
import HomeAdsColumns from '@/components/partials/homepage/home-default/HomeAdsColumns';
import HomeDefaultTopCategories from '@/components/partials/homepage/home-default/HomeDefaultTopCategories';
import HomeDefaultProductListing from '@/components/partials/homepage/home-default/HomeDefaultProductListing';
import HomeAds from '@/components/partials/homepage/home-default/HomeAds';
import DownloadApp from '@/components/partials/commons/DownLoadApp';
import NewArrivals from '@/components/partials/homepage/home-default/NewArrivals';
import Newsletters from '@/components/partials/commons/Newletters';

export default function Home() {
  return (
    <PageContainer title="Multipurpose Marketplace React Ecommerce Template">
      <main id="homepage-1">
        <HomeDefaultBanner />
        <SiteFeatures />
        <HomeDefaultDealOfDay collectionSlug="deal-of-the-day" />
        <HomeAdsColumns />
        <HomeDefaultTopCategories />
        <HomeDefaultProductListing
          collectionSlug="consumer-electronics"
          title="Consumer Electronics"
        />
        <HomeDefaultProductListing
          collectionSlug="clothings"
          title="Clothings"
        />
        <HomeDefaultProductListing
          collectionSlug="garden-and-kitchen"
          title="Garden & Kitchen"
        />
        <HomeAds />
        <DownloadApp />
        <NewArrivals collectionSlug="new-arrivals-products" />
        <Newsletters />
      </main>
    </PageContainer>
  );
} 