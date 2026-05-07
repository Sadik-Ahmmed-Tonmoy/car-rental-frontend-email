"use client";

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative">
        <div className="w-full h-60 bg-gray-200"></div>

        {/* Heart Icon Skeleton */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-300"></div>

        {/* Image Counter Skeleton */}
        <div className="absolute bottom-3 right-3 w-12 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

        {/* Subtitle Skeleton */}
        <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>

        {/* Features Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6 mb-4"></div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>

        {/* Price Skeleton */}
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>

        {/* Location and Rating Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
