// src/components/shared/EventTableSkeleton.tsx
const EventTableSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-t-lg p-4 h-16 border-b border-light-gray"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white p-4 h-16 border-b border-light-gray flex items-center justify-between">
        <div className="w-1/4 h-5 bg-gray-300 rounded"></div>
        <div className="w-1/4 h-5 bg-gray-300 rounded"></div>
        <div className="w-1/4 h-5 bg-gray-300 rounded"></div>
        <div className="w-1/12 h-5 bg-gray-300 rounded"></div>
        <div className="w-1/6 flex justify-center gap-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    ))}
  </div>
);
export default EventTableSkeleton;