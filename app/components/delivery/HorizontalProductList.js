import React from 'react';

export default function HorizontalProductList({ title, products, onSeeAll }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {onSeeAll && (
          <button className="text-green-600 font-medium text-sm" onClick={onSeeAll}>see all</button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-start">
            <div className="w-full h-28 flex items-center justify-center mb-2 overflow-hidden">
              <img src={product.image} alt={product.name} className="h-24 object-contain" />
            </div>
            <div className="flex items-center text-xs bg-grey-700 text-gray-500 mb-1">
              <span className="mr-1">🕒</span> 9 MINS
            </div>
            <div className="font-medium text-sm mb-1">{product.name}</div>
            <div className="text-xs text-gray-500 mb-1">{product.details}</div>
            <div className="flex items-center justify-between w-full mt-2">
              <span className="font-semibold">₹{product.price}</span>
              <button className="border border-green-600 text-green-600 px-4 py-1 rounded-md text-sm font-medium hover:bg-green-50">ADD</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 