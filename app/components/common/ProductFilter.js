"use client"

const  ProductFilter = () =>
{
    return (
        <>
        <aside className="w-60 bg-white border border-gray-100 rounded-lg p-4 h-[calc(100vh-64px-56px)] mt-0">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2 text-sm">Categories</h3>
            <ul className="space-y-1 text-gray-600">
              <li className="font-semibold text-blue-700 text-sm">Mobiles & Accessories</li>
              <li className="ml-4 cursor-pointer hover:text-blue-600 text-sm">Mobiles</li>
              <li className="ml-4 cursor-pointer hover:text-blue-600 text-sm">Tablets</li>
            </ul>
          </div>
          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2 text-sm">Price</h3>
            <div className="flex items-center gap-2">
              <input type="range" min="0" max="30000" className="w-full accent-blue-600" />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹30,000+</span>
            </div>
          </div>
          {/* Brand Filter */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Brand</h3>
            <input type="text" placeholder="Search Brand" className="w-full mb-2 px-2 py-1 border rounded text-sm" />
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Apple</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Samsung</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Google</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> MOTOROLA</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> vivo</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> OPPO</label>
              <span className="text-blue-600 text-xs cursor-pointer ">167 MORE</span>
            </div>
          </div>
        </aside>
        </>
    );
}

export default ProductFilter;