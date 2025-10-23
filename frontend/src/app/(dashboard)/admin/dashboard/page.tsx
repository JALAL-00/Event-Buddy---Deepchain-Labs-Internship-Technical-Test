// src/app/(dashboard)/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // For navigation

import api from '@/lib/axios';
import type { Event } from '@/types';
import EventTableSkeleton from '@/components/shared/EventTableSkeleton';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth to check role

const formatTableDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); // Get user from auth context
  const router = useRouter();

  useEffect(() => {
    // PROTECT ROUTE: Redirect if not an admin
    if (user && user.role !== 'ADMIN') {
        router.push('/'); // Or a dedicated '/unauthorized' page
        return;
    }

    if (user) { // Only fetch if the user is identified
      const fetchEvents = async () => {
        try {
          const response = await api.get<Event[]>('/events');
          setEvents(response.data);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch events.');
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [user, router]); // Re-run effect if user or router changes


  // Render skeleton or a loading indicator while auth is being checked
  if (!user) {
    return <EventTableSkeleton />;
  }

  return (
    <div className="py-12 bg-light-violet">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-dark-gray">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-medium-gray">
          Manage events, view registrations, and monitor your platform.
        </p>

        {/* Events Table Section */}
        <div className="mt-10 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-light-gray">
            <h2 className="text-xl font-bold text-dark-gray">Events Management</h2>
            <Link href="/admin/create-event">
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-blue rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
                Create Event
              </button>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? <EventTableSkeleton /> :
             error ? <p className="p-6 text-center text-danger-red">{error}</p> :
             (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-gray uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-gray uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-gray uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-dark-gray uppercase tracking-wider">Registrations</th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-dark-gray uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-gray">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-dark-gray">{event.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium-gray">{formatTableDate(event.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium-gray">{event.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium-gray">{`${event.bookedSeats} / ${event.capacity}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center items-center gap-4">
                          <Link href={`/events/${event.id}`} title="View">
                              <Eye className="w-5 h-5 text-gray-500 hover:text-primary-blue transition-colors" />
                          </Link>
                          <button title="Edit">
                            <Pencil className="w-5 h-5 text-gray-500 hover:text-green-600 transition-colors" />
                          </button>
                          <button title="Delete">
                            <Trash2 className="w-5 h-5 text-gray-500 hover:text-danger-red transition-colors" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
             { !loading && events.length === 0 && <p className='text-center p-8 text-medium-gray'>No events found. Time to create one!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}