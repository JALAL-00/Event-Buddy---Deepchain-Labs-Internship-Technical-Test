// src/app/events/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    Ticket,
} from 'lucide-react';

import api from '@/lib/axios';
import { cn, formatEventDetailsDate } from '@/lib/utils';
import type { Event } from '@/types';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import EventDetailSkeleton from '@/components/shared/EventDetailSkeleton';

export default function EventDetailPage() {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSeats, setSelectedSeats] = useState(1);

    const params = useParams();
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
            setLoading(true);
            try {
                // We use the '/public/find' endpoint as specified in the backend
                const response = await api.post<Event>('/events/public/find', { id });
                setEvent(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch event details. It might not exist.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBooking = () => {
        // Here, you would check for authentication.
        // For now, we simulate this by assuming the user is not logged in.
        const isAuthenticated = false; // Replace with actual auth check later
        
        if (!isAuthenticated) {
            router.push('/login');
        } else {
            // Proceed to actual booking logic
            alert(`Booking ${selectedSeats} seat(s) for ${event?.title}`);
        }
    };
    
    const formattedDate = event ? formatEventDetailsDate(event.date) : null;

    return (
        <>
            <Navbar />
            <main className="pt-24 pb-16">
                {loading && <EventDetailSkeleton />}
                {error && <div className="text-center text-danger-red">{error}</div>}

                {!loading && event && (
                    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2 text-medium-gray font-semibold hover:text-primary-blue mb-6">
                            <ArrowLeft size={20} />
                            <span>Back to events</span>
                        </Link>
                        
                        {/* Event Image */}
                        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6 shadow-lg">
                           <Image 
                             src={event.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${event.imageUrl}` : '/images/event-placeholder.jpg'} 
                             alt={event.title} 
                             layout="fill" 
                             objectFit="cover"
                             priority
                           />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                           {event.tags.map(tag => (
                             <span key={tag} className="bg-indigo-100 text-primary-blue text-sm font-semibold px-4 py-1.5 rounded-full">{tag}</span>
                           ))}
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold text-dark-gray mb-4">{event.title}</h1>
                        
                        {/* Event Details Card */}
                        <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mb-8">
                            <div className="flex items-center gap-4">
                                <Calendar className="w-8 h-8 text-primary-blue" />
                                <div>
                                    <p className="font-semibold text-dark-gray">Date</p>
                                    <p className="text-medium-gray">{formattedDate?.fullDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Clock className="w-8 h-8 text-primary-blue" />
                                <div>
                                    <p className="font-semibold text-dark-gray">Time</p>
                                    <p className="text-medium-gray">{formattedDate?.timeRange}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <MapPin className="w-8 h-8 text-primary-blue" />
                                <div>
                                    <p className="font-semibold text-dark-gray">Location</p>
                                    <p className="text-medium-gray">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Section */}
                        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
                            <h2 className="text-2xl font-bold text-dark-gray mb-6">Select Number of Seats</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                                {[1, 2, 3, 4].map((seatCount) => (
                                    <button 
                                      key={seatCount} 
                                      onClick={() => setSelectedSeats(seatCount)}
                                      className={cn(
                                          "flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all duration-300",
                                          selectedSeats === seatCount 
                                            ? 'border-primary-blue bg-indigo-50' 
                                            : 'border-light-gray hover:border-gray-400'
                                      )}
                                    >
                                        <Ticket size={28} className={cn("mb-2", selectedSeats === seatCount ? "text-primary-blue" : "text-medium-gray")} />
                                        <span className="text-xl font-bold text-dark-gray">{seatCount}</span>
                                        <span className="text-sm text-medium-gray">{seatCount === 1 ? 'Seat' : 'Seats'}</span>
                                    </button>
                                ))}
                            </div>
                            <button 
                                onClick={handleBooking}
                                className="px-10 py-3 text-base font-semibold text-white bg-primary-blue rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                            >
                                Book {selectedSeats} {selectedSeats === 1 ? 'Seat' : 'Seats'}
                            </button>
                        </div>
                        
                        {/* About Section */}
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-dark-gray mb-4">About this event</h2>
                            <p className="text-medium-gray leading-relaxed whitespace-pre-line">{event.description}</p>
                        </div>

                        {/* Spots Left */}
                        <div className="border-t border-light-gray pt-6 flex items-center gap-4 text-xl text-dark-gray font-semibold">
                            <Users size={28} className="text-primary-blue" />
                            <span>{event.spotsLeft} Spots Left</span>
                            <span className="text-base text-gray-400 font-normal">({event.capacity - event.spotsLeft} registered)</span>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}