'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Event, PaginatedEvents } from '@/types';

import EventCard from './EventCard';
import EventCardSkeleton from './EventCardSkeleton';
import Pagination from '../ui/Pagination';

interface EventListProps {
  title: string;
  type: 'upcoming' | 'past';
}

const EventList = ({ title, type }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await api.get<PaginatedEvents>(`/events/${type}`, {
            params: {
                page: currentPage,
                limit: 6,
            }
        });
        setEvents(response.data.data);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError(`Failed to load ${type} events.`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [type, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-dark-gray mb-8">{title}</h2>
        
        {error && <p className="text-center text-danger-red">{error}</p>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
            ))
          ) : (
            events.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </div>
        
        {!loading && !error && events.length === 0 && (
          <p className="text-center text-medium-gray mt-8">No events to show here.</p>
        )}
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default EventList;
