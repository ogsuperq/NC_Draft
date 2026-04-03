import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Plus, Plane, Users as GuestsIcon, Star } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LifestylePage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API}/events`);
      setEvents(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = ['all', 'event', 'travel', 'guest'];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.type === filter);

  const getEventIcon = (type) => {
    switch (type) {
      case 'travel': return Plane;
      case 'guest': return GuestsIcon;
      case 'event': return Star;
      default: return CalendarIcon;
    }
  };

  const typeColors = {
    event: 'bg-purple-500/20 text-purple-400',
    travel: 'bg-blue-500/20 text-blue-400',
    guest: 'bg-green-500/20 text-green-400'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-luxury-white/60 text-sm uppercase tracking-[0.2em]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-12 space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light tracking-tight text-luxury-white">
            Lifestyle & Events
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60 mt-2">
            Your Personal Calendar
          </p>
        </div>

        <button data-testid="add-event-button" className="luxury-button-primary px-6 py-3 rounded-sm flex items-center space-x-2">
          <Plus size={18} strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-[0.2em]">Add Event</span>
        </button>
      </div>

      {/* Filter */}
      <div data-testid="event-type-filter" className="flex space-x-2">
        {eventTypes.map((type) => (
          <button
            key={type}
            data-testid={`event-filter-${type}`}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-sm luxury-transition ${
              filter === type
                ? 'luxury-button-primary'
                : 'luxury-button-secondary'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Events Timeline */}
      <div className="space-y-6">
        {filteredEvents.map((event) => {
          const Icon = getEventIcon(event.type);
          const eventDate = new Date(event.date);
          const isUpcoming = eventDate >= new Date();

          return (
            <div 
              key={event.id} 
              data-testid={`event-item-${event.id}`}
              className="luxury-card rounded-sm p-8"
            >
              <div className="flex items-start space-x-6">
                {/* Date Block */}
                <div className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 rounded-sm border border-luxury-border-active flex flex-col items-center justify-center">
                    <span className="text-xs uppercase tracking-wider text-luxury-gold">
                      {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-heading font-light text-luxury-white">
                      {eventDate.getDate()}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Icon size={20} strokeWidth={1.5} className="text-luxury-gold" />
                      <h2 className="text-xl font-heading font-normal text-luxury-white">{event.title}</h2>
                    </div>
                    <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-sm ${typeColors[event.type]}`}>
                      {event.type}
                    </span>
                  </div>

                  {event.estate && (
                    <p className="text-sm text-luxury-gold mb-2">{event.estate}</p>
                  )}

                  {event.description && (
                    <p className="text-base font-light text-luxury-white/80 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-luxury-border-subtle">
                    <span className={`text-xs uppercase tracking-wider ${
                      isUpcoming ? 'text-luxury-gold' : 'text-luxury-white/40'
                    }`}>
                      {isUpcoming ? 'Upcoming' : 'Past Event'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <p className="text-luxury-white/40 text-sm uppercase tracking-[0.2em]">No events scheduled</p>
        </div>
      )}
    </div>
  );
};

export default LifestylePage;