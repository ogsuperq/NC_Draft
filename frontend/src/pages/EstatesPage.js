import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, AlertCircle, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EstatesPage = () => {
  const [estates, setEstates] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstates();
  }, []);

  const fetchEstates = async () => {
    try {
      const response = await axios.get(`${API}/estates`);
      setEstates(response.data);
    } catch (error) {
      console.error('Error fetching estates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEstates = filter === 'all' 
    ? estates 
    : estates.filter(e => e.status === filter);

  const statusColors = {
    occupied: 'bg-green-500/20 text-green-400',
    preparing: 'bg-yellow-500/20 text-yellow-400',
    vacant: 'bg-luxury-surface text-luxury-white/40'
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
            Estate Portfolio
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60 mt-2">
            {estates.length} Properties Worldwide
          </p>
        </div>

        {/* Filter */}
        <div data-testid="estate-filter" className="flex space-x-2">
          {['all', 'occupied', 'preparing', 'vacant'].map((status) => (
            <button
              key={status}
              data-testid={`filter-${status}`}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-sm luxury-transition ${
                filter === status
                  ? 'luxury-button-primary'
                  : 'luxury-button-secondary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Estates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredEstates.map((estate) => (
          <Link
            key={estate.id}
            to={`/estates/${estate.id}`}
            data-testid={`estate-item-${estate.id}`}
            className="group"
          >
            <div className="luxury-card rounded-sm overflow-hidden">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={estate.image}
                  alt={estate.name}
                  className="w-full h-full object-cover luxury-transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-sm ${statusColors[estate.status]}`}>
                    {estate.status}
                  </span>
                </div>

                {/* Maintenance Alert */}
                {estate.maintenanceAlerts > 0 && (
                  <div data-testid={`maintenance-alert-${estate.id}`} className="absolute top-4 left-4 flex items-center space-x-1 bg-red-500/90 px-3 py-1 rounded-sm">
                    <AlertCircle size={14} strokeWidth={1.5} className="text-white" />
                    <span className="text-xs text-white font-medium">{estate.maintenanceAlerts} Alert{estate.maintenanceAlerts > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-heading font-normal text-luxury-white mb-2">{estate.name}</h2>
                  <div className="flex items-center space-x-2 text-luxury-white/60">
                    <MapPin size={14} strokeWidth={1.5} />
                    <p className="text-sm">{estate.location}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-luxury-border-subtle flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-1">Size</p>
                    <p className="text-sm text-luxury-white">{estate.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-1">Last Visit</p>
                    <p className="text-sm text-luxury-white">{new Date(estate.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredEstates.length === 0 && (
        <div className="text-center py-16">
          <p className="text-luxury-white/40 text-sm uppercase tracking-[0.2em]">No estates found</p>
        </div>
      )}
    </div>
  );
};

export default EstatesPage;