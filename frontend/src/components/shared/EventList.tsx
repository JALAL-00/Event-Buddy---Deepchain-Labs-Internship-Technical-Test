// src/components/shared/EventList.tsx
import EventCardSkeleton from "./EventCardSkeleton";

// We'll add real data props later
interface EventListProps {
  title: string;
}

const EventList = ({ title }: EventListProps) => {
  const isLoading = true; // Set to true to show skeletons, we'll replace this later with API state

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark-gray mb-8">{title}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* We'll replace this with a map over real data later */}
          {isLoading && (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          )}
        </div>

        {/* Pagination placeholder - we will make this functional later */}
        <div className="mt-12 flex justify-center items-center space-x-2">
            <button className="px-4 py-2 text-sm font-semibold text-white bg-primary-blue rounded-md shadow-sm">1</button>
            <button className="px-4 py-2 text-sm font-semibold text-dark-gray bg-white rounded-md border border-light-gray hover:bg-gray-50">2</button>
            <button className="px-4 py-2 text-sm font-semibold text-dark-gray bg-white rounded-md border border-light-gray hover:bg-gray-50">3</button>
            <span className="text-medium-gray">...</span>
            <button className="px-4 py-2 text-sm font-semibold text-dark-gray bg-white rounded-md border border-light-gray hover:bg-gray-50">67</button>
            <button className="px-4 py-2 text-sm font-semibold text-dark-gray bg-white rounded-md border border-light-gray hover:bg-gray-50">68</button>
        </div>
      </div>
    </section>
  );
};

export default EventList;