// frontend/src/components/shared/EventList.tsx

'use client'; // This component fetches data and uses state, so it's a client component.

import { useState, useEffect, useCallback } from 'react';
import { IEvent, PaginatedResponse } from '@/types';
import api from '@/lib/axios';
import EventCard from './EventCard';
import EventCardSkeleton from './EventCardSkeleton';
// We will create this component next
import Pagination from '../ui/Pagination';

// Define the component's props
type EventListProps = {
  title: string;
  type: 'upcoming' | 'past';
};

const EventList = ({ title, type }: EventListProps) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const limit = 6; // Display 6 events per page

  // useCallback memoizes the function so it doesn't get recreated on every render
  const fetchEvents = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // The API endpoint is determined by the 'type' prop
      const endpoint = `/events/${type}`;
      const response = await api.get<PaginatedResponse<IEvent>>(endpoint, {
        params: {
          page,
          limit,
        },
      });

      // Update state with data from the API response
      setEvents(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
    } catch (err) {
      console.error(`Failed to fetch ${type} events:`, err);
      setError('Could not load events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [type]); // The function depends on the 'type' prop

  // useEffect to trigger the data fetch when the component mounts or when currentPage changes.
  useEffect(() => {
    fetchEvents(currentPage);
  }, [fetchEvents, currentPage]);
  
  const handlePageChange = (page: number) => {
    // We just need to update the currentPage state.
    // The useEffect hook will automatically trigger a re-fetch.
    setCurrentPage(page);
    // Optional: Scroll to the top of the list when a new page is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // A helper function to render the main content based on the state
  const renderContent = () => {
    if (isLoading) {
      return (
        // Render a grid of 6 skeleton loaders
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: limit }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-danger-red">{error}</p>;
    }

    if (events.length === 0) {
      return <p className="text-center text-medium-gray">No events found.</p>;
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };
  
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark-gray mb-8">{title}</h2>
        
        {/* Render content based on the loading/error/data state */}
        {renderContent()}

        {/* Render pagination controls if not loading, no errors, and more than one page exists */}
        {!isLoading && !error && events.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default EventList;
