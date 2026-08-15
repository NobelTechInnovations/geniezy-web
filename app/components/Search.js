'use client';

import { useState, useRef, useEffect } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  useSearchBox,
  useHits,
  Configure,
} from 'react-instantsearch-hooks-web';
import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slugify } from '@/app/shared/utils/titleFormat';
import { eventApi } from '../redux/services/apiService';
import { getAnonymousId } from '../services/browsingHistory/anonymousId';

const baseSearchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

// Wrap the client so an unreachable/misconfigured Algolia index degrades to
// "no results" instead of an uncaught promise rejection crashing the page.
const searchClient = {
  ...baseSearchClient,
  search(requests) {
    return baseSearchClient.search(requests).catch(() => ({
      results: requests.map(() => ({
        hits: [],
        nbHits: 0,
        page: 0,
        nbPages: 0,
        hitsPerPage: 0,
        exhaustiveNbHits: true,
        query: '',
        params: '',
      })),
    }));
  },
};

function CustomSearchBox({ onFocus, setInputValue, onSubmitSearch }) {
  const { query, refine } = useSearchBox();
  const [input, setInput] = useState(query);
  const isFirstRender = useRef(true);
  const trackTimeoutRef = useRef(null);

  useEffect(() => {
    // Skip the initial mount so we don't fire an empty search on every page load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    refine(input);
    setInputValue(input);

    // Debounced server-side tracking — fires once the user pauses typing
    // (not per keystroke) so the home feed's personalization signal isn't
    // flooded with partial queries like "s", "sh", "sho".
    if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current);
    const trimmed = input.trim();
    if (trimmed.length >= 2) {
      trackTimeoutRef.current = setTimeout(() => {
        eventApi.track({
          eventType: 'search',
          searchQuery: trimmed,
          anonId: getAnonymousId(),
        });
      }, 600);
    }

    return () => {
      if (trackTimeoutRef.current) clearTimeout(trackTimeoutRef.current);
    };
  }, [input]);




  return (
    <div className="relative ">
      <input
        type="text"
        placeholder="I'm shopping for... Tshirts, Washing Machines, or Daily Essentials"
        value={input}
        onFocus={onFocus}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          // Enter submits a full, tracked search (backend-owned results
          // page) — distinct from the live Algolia dropdown above, which
          // stays exactly as-is for as-you-type suggestions.
          if (e.key === 'Enter' && input.trim().length > 0) {
            onSubmitSearch?.(input.trim());
          }
        }}
        className="w-full h-10 px-2 pr-10 border rounded-md border-gray-300 text-sm text-black focus:outline-none"
      />

      <button
        type="button"
        aria-label="Search"
        onClick={() => input.trim().length > 0 && onSubmitSearch?.(input.trim())}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        <FiSearch className="text-gray-500 w-5 h-5" />
      </button>
    </div>
  );
}

function CustomHits({ onSelect }) {
  const { hits } = useHits();

  if (hits.length === 0) return null;

  return (
    <ul className="absolute top-11 left-0 w-full bg-white shadow-lg border rounded-md z-50 max-h-64 overflow-y-auto">
      {hits.map((hit) => (
        <li
          key={hit.objectID}
          className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
          onClick={onSelect}
        >
          <Link
            href={`/gspin/${hit.product_id}/${slugify(hit.name)}?pid=${hit.objectID}&p_sku=${hit.sku}&type=${hit.type}`}
          >
            {hit.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Search() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowDropdown = showDropdown && inputValue.trim() !== '';

  return (
    <div ref={containerRef} className="relative w-full md:w-3xl mx-auto">
      <InstantSearch searchClient={searchClient} indexName="products">
        <Configure hitsPerPage={8} />
        <CustomSearchBox
          onFocus={() => setShowDropdown(true)}
          setInputValue={setInputValue}
          onSubmitSearch={(q) => {
            setShowDropdown(false);
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
        />
        {shouldShowDropdown && <CustomHits onSelect={() => setShowDropdown(false)} />}
      </InstantSearch>
    </div>
  );
}


