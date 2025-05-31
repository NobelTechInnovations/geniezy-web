'use client';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch(
  'RKH1HMLBYM',
  '84f8dd435608c296c835f6b5cda3977f'
);

function Hit({ hit }) {
  return (
    <div className="border p-4 rounded">
      <h2 className="font-bold text-lg">{hit.name}</h2>
      <p>{hit.description}</p>
      <img src={hit.images?.[0]} alt={hit.name} className="w-32" />
      <p className="text-sm text-gray-600">Price: ${hit.price}</p>
    </div>
  );
}

export default function Search() {
  return (
    <InstantSearch searchClient={searchClient} indexName="products">
      <SearchBox placeholder="Search products..." />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  );
}
