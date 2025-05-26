import S3Image from '@/app/shared/utils/S3Image';
import Link from 'next/link';
import React from 'react';

const CategorySkeleton = () => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-2" />
    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
  </div>
);

export default function HorizontalCategoryList({ categories, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 py-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 py-4">
      {categories.map((cat) => (
        <Link href={`/delivery-now/grocery-fresh?gc_id=${cat.id}`}>
            <div key={cat.id} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
                    <S3Image
                        src={cat.image} alt={cat.name} className="w-14 h-14 object-contain" />
                </div>
                <span className="text-xs text-center font-medium whitespace-nowrap">{cat.name}</span>
            </div>
        </Link>
      ))}
    </div>
  );
} 