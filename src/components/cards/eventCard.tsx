import { Event } from '@/types/event';

interface Props {
  event: Event;
  className?: string;
}

export default function EventCard({ event, className = '' }: Props) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center mt-2">
        <h3 className="text-sm font-semibold">{event.name}</h3>
        <p className="text-xs text-gray-500">{event.date}</p>
        <p className="text-xs text-gray-400">{event.location}</p>
      </div>
    </div>
  );
}
