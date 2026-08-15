'use client';

import { useEffect, useRef, useState } from 'react';
import ProductCard from './products/ProductCard';
import ProductCardSkeleton from './products/ProductCardSkeleton';
import { recommendationApi, eventApi } from '../../redux/services/apiService';
import { getLocationFromLocalStorage } from './LocationDropdown';
import { getAnonymousId } from '../../services/browsingHistory/anonymousId';

/**
 * Context-aware recommendation rails (Phase 4, M3) — one component reused
 * on every placement (home/category/pdp/cart/search). Fetches from the
 * unified /gz/recommendations endpoint, renders each returned rail with the
 * same ProductCard used everywhere else (visual consistency), and tracks
 * recommendation_impression (batch, on render) + recommendation_click
 * (on click) so seller/admin analytics can measure recommendation
 * performance per placement.
 *
 * Props:
 *  - context: 'home'|'category'|'pdp'|'cart'|'search' (required)
 *  - categoryId / productId / searchQuery / cartProductIds: context-specific
 *  - className: optional wrapper className override
 */
export default function RecommendationRail({ context, categoryId, productId, searchQuery, cartProductIds, className = '' }) {
  const [rails, setRails] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackedImpressions = useRef(new Set());

  useEffect(() => {
    let cancelled = false;

    const fetchRecs = async () => {
      try {
        setLoading(true);
        const location = getLocationFromLocalStorage();
        const response = await recommendationApi.getRecommendations({
          context,
          categoryId,
          productId,
          searchQuery,
          cartProductIds,
          lat: location?.latitude,
          lng: location?.longitude,
          anonId: getAnonymousId(),
        });
        if (!cancelled && response.success) {
          setRails(response.data.rails || []);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        if (!cancelled) setRails([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecs();
    return () => { cancelled = true; };
    // cartProductIds is an array — stringify so the effect doesn't refire
    // every render on a new-but-equal array reference from the caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, categoryId, productId, searchQuery, JSON.stringify(cartProductIds)]);

  // Fire one batch recommendation_impression per rail, once per render
  // (guarded so re-renders from unrelated state changes don't double-track).
  useEffect(() => {
    rails.forEach((rail) => {
      const key = `${rail.placement}:${rail.title}:${rail.products.map((p) => p._id).join(',')}`;
      if (trackedImpressions.current.has(key) || rail.products.length === 0) return;
      trackedImpressions.current.add(key);
      eventApi.track({
        eventType: 'recommendation_impression',
        placement: rail.placement,
        basedOn: rail.based_on,
        productIds: rail.products.map((p) => p.product_id),
        positions: rail.products.map((_, i) => i + 1),
        anonId: getAnonymousId(),
      });
    });
  }, [rails]);

  const handleCardClick = (rail, position, product) => {
    eventApi.track({
      eventType: 'recommendation_click',
      productId: product.product_id,
      categoryId: product.category_id?._id,
      placement: rail.placement,
      basedOn: rail.based_on,
      position,
      anonId: getAnonymousId(),
    });
  };

  if (loading) {
    return (
      <div className={`container mx-auto ${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (rails.length === 0) return null;

  return (
    <div className={`container mx-auto flex flex-col gap-6 ${className}`}>
      {rails.map((rail) => (
        <div key={rail.placement + rail.title}>
          <h2 className="text-lg font-semibold mb-2">{rail.title}</h2>
          <div
            className="flex overflow-x-auto gap-2 pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {rail.products.map((product, i) => (
              <div key={product._id} className="min-w-[160px] max-w-[200px] flex-shrink-0">
                <ProductCard product={product} onCardClick={(p) => handleCardClick(rail, i + 1, p)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
