// Generic shimmer block — replaces the many hand-rolled
// `animate-pulse` + gray-box duplicates scattered across the app (cart's
// plain "loading..." text, orders list, etc). Not a mechanical replacement
// of every existing skeleton (ProductCardSkeleton, PDP's ProductSkeleton
// stay as-is), just the shared primitive new/touched loading states use
// going forward.
export default function Skeleton({ className = '', rounded = 'rounded-md' }) {
  return <div className={`animate-pulse bg-gray-200 ${rounded} ${className}`} />;
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
