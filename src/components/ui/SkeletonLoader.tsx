export function SkeletonLoader({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-3 w-20" />
      </div>
      <SkeletonLoader lines={3} />
      <div className="flex gap-2 mt-5 pt-3 border-t border-walnut/50">
        <div className="skeleton h-7 w-16 rounded-md" />
        <div className="skeleton h-7 w-16 rounded-md" />
        <div className="skeleton h-7 w-20 rounded-md" />
      </div>
    </div>
  );
}
