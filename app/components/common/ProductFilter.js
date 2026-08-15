"use client"

import { useState, useEffect } from "react";

const DEFAULT_MAX_PRICE = 100000;

// Sidebar product filter — price range, brand checkboxes, subcategory list.
// Was previously a static/decorative mock (hardcoded fake brands, no state,
// no props); now wired to real data from the category API response and
// reports filter changes upward via onFilterChange. Same visual layout as
// before, only the data/behavior is now real.
const ProductFilter = ({ subcategories = [], brands = [], onFilterChange, categorySlug, categoryId }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Reset filters when navigating to a different category
  useEffect(() => {
    setMinPrice(0);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSelectedBrands([]);
    setSelectedSubcategory(null);
  }, [categoryId]);

  useEffect(() => {
    onFilterChange?.({
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < DEFAULT_MAX_PRICE ? maxPrice : undefined,
      brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
      subcategory: selectedSubcategory || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, selectedBrands, selectedSubcategory]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const visibleBrands = brandSearch
    ? brands.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()))
    : brands;

  return (
    <>
    {/* hidden below md: this sidebar is a fixed 240px and always rendered,
        so on a 375px phone it plus the product grid forced the page to
        ~1700px wide — every category/search page scrolled sideways and the
        grid ran off-screen. Desktop layout is unchanged. Mobile filtering
        needs its own bottom-sheet/drawer UI; that's a follow-up, and until
        then no filters is strictly better than a broken page. */}
    <aside className="hidden md:block w-60 shrink-0 bg-white border border-gray-100 rounded-lg p-4 h-[calc(100vh-64px-56px)] mt-0 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2 text-sm">Categories</h3>
          <ul className="space-y-1 text-gray-600">
            <li
              onClick={() => setSelectedSubcategory(null)}
              className={`text-sm cursor-pointer ${!selectedSubcategory ? 'font-semibold text-blue-700' : 'hover:text-blue-600'}`}
            >
              All
            </li>
            {subcategories.map((sub) => (
              <li
                key={sub._id}
                onClick={() => setSelectedSubcategory(sub._id)}
                className={`ml-4 cursor-pointer text-sm ${selectedSubcategory === sub._id ? 'font-semibold text-blue-700' : 'hover:text-blue-600'}`}
              >
                {sub.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2 text-sm">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={DEFAULT_MAX_PRICE}
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>₹0</span>
          <span>₹{maxPrice.toLocaleString('en-IN')}{maxPrice >= DEFAULT_MAX_PRICE ? '+' : ''}</span>
        </div>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Brand</h3>
          <input
            type="text"
            placeholder="Search Brand"
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full mb-2 px-2 py-1 border rounded text-sm"
          />
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {visibleBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}
    </aside>
    </>
  );
}

export default ProductFilter;
