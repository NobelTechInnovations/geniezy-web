const ProductCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-2 flex flex-col items-center animate-pulse">
      <div className="w-full aspect-square bg-gray-200 rounded mb-2" />
      <div className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
      <div className="w-1/2 h-3 bg-gray-200 rounded mb-2" />
      <div className="w-2/3 h-6 bg-gray-200 rounded mb-2" />
      <div className="w-1/4 h-3 bg-gray-200 rounded" />
    </div>
  );
};

export default ProductCardSkeleton; 