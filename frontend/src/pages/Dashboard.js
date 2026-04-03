import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Users, Briefcase, AlertCircle, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [estates, setEstates] = useState([]);
  const [staff, setStaff] = useState([]);
  const [events, setEvents] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [estatesRes, staffRes, eventsRes] = await Promise.all([
        axios.get(`${API}/estates`),
        axios.get(`${API}/staff`),
        axios.get(`${API}/events`)
      ]);

      setEstates(estatesRes.data);
      setStaff(staffRes.data);
      setEvents(eventsRes.data);

      // Get AI suggestion
      const aiRes = await axios.post(`${API}/ai/suggest`, {
        context: `${estatesRes.data.length} estates, ${staffRes.data.filter(s => s.status === 'on-duty').length} staff on duty, ${eventsRes.data.length} upcoming events`
      });
      setAiSuggestion(aiRes.data.suggestions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { name: 'Total Estates', value: estates.length, icon: Home, color: 'text-luxury-gold' },
    { name: 'Active Staff', value: staff.filter(s => s.status === 'on-duty').length, icon: Users, color: 'text-luxury-gold' },
    { name: 'Upcoming Events', value: events.length, icon: Calendar, color: 'text-luxury-gold' },
    { name: 'Maintenance Alerts', value: estates.reduce((sum, e) => sum + (e.maintenanceAlerts || 0), 0), icon: AlertCircle, color: 'text-red-400' },
  ];

  const occupiedEstates = estates.filter(e => e.status === 'occupied');
  const upcomingEvents = events.slice(0, 3);

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
      <div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light tracking-tight text-luxury-white">
          Global Estate Overview
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60 mt-2">
          Command Center
        </p>
      </div>

      {/* AI Suggestion Banner */}
      {aiSuggestion && (
        <div data-testid="ai-suggestion-banner" className="luxury-card rounded-sm p-6 border-luxury-gold/30">
          <div className="flex items-start space-x-4">
            <Sparkles size={20} strokeWidth={1.5} className="text-luxury-gold mt-1" />
            <div className="flex-1">
              <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold mb-2">Intelligence Insight</h3>
              <p className="text-base font-light text-luxury-white leading-relaxed">{aiSuggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} data-testid={`stat-${stat.name.toLowerCase().replace(/\s+/g, '-')}`} className="luxury-card rounded-sm p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/60 mb-2">{stat.name}</p>
                  <p className="text-3xl font-heading font-light text-luxury-white">{stat.value}</p>
                </div>
                <Icon size={24} strokeWidth={1.5} className={stat.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Occupied Estates */}
        <div data-testid="occupied-estates-section" className="luxury-card rounded-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-normal text-luxury-white">Currently Occupied</h2>
            <Link to="/estates" className="text-sm text-luxury-gold hover:text-luxury-gold-hover luxury-transition">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {occupiedEstates.length > 0 ? (
              occupiedEstates.map((estate) => (
                <Link 
                  key={estate.id} 
                  to={`/estates/${estate.id}`}
                  data-testid={`estate-card-${estate.id}`}
                  className="block group"
                >
                  <div className="flex items-center space-x-4 p-4 rounded-sm border border-luxury-border-subtle group-hover:border-luxury-border-active luxury-transition">
                    <img
                      src={estate.image}
                      alt={estate.name}
                      className="w-16 h-16 object-cover rounded-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-light text-luxury-white truncate">{estate.name}</h3>
                      <p className="text-sm text-luxury-white/60">{estate.location}</p>
                    </div>
                    {estate.maintenanceAlerts > 0 && (
                      <div className="flex items-center space-x-1 text-red-400">
                        <AlertCircle size={16} strokeWidth={1.5} />
                        <span className="text-xs">{estate.maintenanceAlerts}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-luxury-white/40 text-center py-8">No estates currently occupied</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div data-testid="upcoming-events-section" className="luxury-card rounded-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-normal text-luxury-white">Upcoming Events</h2>
            <Link to="/lifestyle" className="text-sm text-luxury-gold hover:text-luxury-gold-hover luxury-transition">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} data-testid={`event-card-${event.id}`} className="p-4 rounded-sm border border-luxury-border-subtle">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-light text-luxury-white mb-1">{event.title}</h3>
                      <p className="text-sm text-luxury-white/60">{event.date}</p>
                      {event.estate && (
                        <p className="text-xs text-luxury-gold mt-1 uppercase tracking-wider">{event.estate}</p>
                      )}
                    </div>
                    <span className="text-xs uppercase tracking-wider text-luxury-white/40 px-2 py-1 rounded-sm border border-luxury-border-subtle">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-luxury-white/40 text-center py-8">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {/* Staff Activity */}
      <div data-testid="staff-activity-section" className="luxury-card rounded-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-normal text-luxury-white">Staff Activity</h2>
          <Link to="/staff" className="text-sm text-luxury-gold hover:text-luxury-gold-hover luxury-transition">
            Manage Staff
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.slice(0, 4).map((member) => (
            <div key={member.id} data-testid={`staff-card-${member.id}`} className="p-4 rounded-sm border border-luxury-border-subtle text-center">
              <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center mx-auto mb-3">
                <span className="text-luxury-black font-medium">{member.name.charAt(0)}</span>
              </div>
              <h3 className="text-sm font-light text-luxury-white mb-1">{member.name}</h3>
              <p className="text-xs text-luxury-white/60 mb-2">{member.role}</p>
              <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded-sm ${
                member.status === 'on-duty' ? 'bg-green-500/20 text-green-400' : 'bg-luxury-surface text-luxury-white/40'
              }`}>
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;