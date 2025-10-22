// src/components/shared/EventCardSkeleton.tsx
const EventCardSkeleton = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-300"></div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Date Block Skeleton */}
            <div className="flex flex-col items-center">
              <div className="h-4 w-10 bg-gray-300 rounded"></div>
              <div className="mt-1 h-8 w-8 bg-gray-400 rounded"></div>
            </div>
            {/* Title and Description Skeleton */}
            <div className="flex-1">
              <div className="h-6 w-3/4 bg-gray-400 rounded"></div>
              <div className="mt-2 h-4 w-full bg-gray-300 rounded"></div>
              <div className="mt-1 h-4 w-5/6 bg-gray-300 rounded"></div>
            </div>
          </div>
  
          {/* Details Skeleton */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-medium-gray">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
  
          {/* Tags Skeleton */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
          </div>
  
          <div className="mt-4 border-t border-light-gray pt-4 flex justify-between text-sm">
            <div className="h-5 w-28 bg-gray-300 rounded"></div>
            <div className="h-5 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EventCardSkeleton;