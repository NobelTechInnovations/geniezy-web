import React from 'react';

export default function HorizontalCategoryList({ categories }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 py-4">
      {categories.map((cat) => (
        <div key={cat.id} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
            <img src={cat.image} alt={cat.name} className="w-14 h-14 object-contain" />
          </div>
          <span className="text-xs text-center font-medium whitespace-nowrap">{cat.name}</span>
        </div>
      ))}
    </div>
  );
} 