export default function MenuSkeleton() {
  return (
    <div className="flex items-center">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="w-25 h-5 bg-gray-200 animate-pulse rounded mr-8"
        ></div>
      ))}
    </div>
  );
}
