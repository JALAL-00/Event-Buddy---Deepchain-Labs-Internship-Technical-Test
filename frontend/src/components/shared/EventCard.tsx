import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import type { Event } from '@/types';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = formatDate(event.date);

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 group">
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${event.imageUrl}` : '/images/event-placeholder.jpg'}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-center">
              <p className="text-primary-blue font-semibold text-sm">{formattedDate.month}</p>
              <p className="text-dark-gray font-bold text-2xl">{formattedDate.day}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-dark-gray truncate group-hover:text-primary-blue">{event.title}</h3>
              <p className="text-sm text-medium-gray mt-1 line-clamp-2">{event.description}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-medium-gray">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {formattedDate.dayOfWeek}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {formattedDate.time}</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {event.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs font-semibold bg-indigo-100 text-primary-blue px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <div className="mt-4 border-t border-light-gray pt-4 flex justify-between items-center text-sm font-medium">
            <span className="flex items-center gap-2 text-green-600">
              <Users size={16} /> {event.spotsLeft} Spots Left
            </span>
            <span className="text-gray-400">Total {event.capacity} Seats</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
