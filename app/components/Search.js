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
import { slugify } from '@/app/shared/utils/titleFormat';

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

function CustomSearchBox({ onFocus, setInputValue }) {
  const { query, refine } = useSearchBox();
  const [input, setInput] = useState(query);

  useEffect(() => {
    refine(input);
    setInputValue(input);
  }, [input]);

  return (
    <div className="relative w-3xl">
      <input
        type="text"
        placeholder="I'm shopping for..."
        value={input}
        onFocus={onFocus}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-10 px-4 pr-10 border rounded-md border-gray-300 text-black focus:outline-none"
      />
      <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
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
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <InstantSearch searchClient={searchClient} indexName="products">
        <Configure hitsPerPage={8} />
        <CustomSearchBox
          onFocus={() => setShowDropdown(true)}
          setInputValue={setInputValue}
        />
        {shouldShowDropdown && <CustomHits onSelect={() => setShowDropdown(false)} />}
      </InstantSearch>
    </div>
  );
}
