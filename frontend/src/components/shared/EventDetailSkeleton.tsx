// src/components/shared/EventDetailSkeleton.tsx
const EventDetailSkeleton = () => {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="mb-6 h-6 w-32 bg-gray-300 rounded-md"></div>
      
      {/* Image skeleton */}
      <div className="w-full h-64 md:h-96 bg-gray-300 rounded-xl mb-6"></div>

      {/* Tags skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-7 w-28 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Title skeleton */}
      <div className="h-10 w-3/4 bg-gray-400 rounded-md mb-6"></div>
      
      {/* Details Card skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1"><div className="h-5 w-3/4 bg-gray-300 rounded"></div></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1"><div className="h-5 w-1/2 bg-gray-300 rounded"></div></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1"><div className="h-5 w-3/4 bg-gray-300 rounded"></div></div>
        </div>
      </div>

      {/* Booking section skeleton */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="h-7 w-1/2 mx-auto bg-gray-400 rounded-md mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
          <div className="h-24 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-12 w-48 mx-auto bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;