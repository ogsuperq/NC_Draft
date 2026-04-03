import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Star, Phone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${API}/vendors`);
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(vendors.map(v => v.category))];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
          Vendor Network
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60 mt-2">
          Vetted Service Providers
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-white/40" />
          <input
            data-testid="vendor-search-input"
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="luxury-input w-full py-3 pl-10 pr-4 rounded-sm bg-luxury-surface"
          />
        </div>

        {/* Category Filter */}
        <div data-testid="category-filter" className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              data-testid={`category-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-sm luxury-transition ${
                categoryFilter === category
                  ? 'luxury-button-primary'
                  : 'luxury-button-secondary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} data-testid={`vendor-item-${vendor.id}`} className="luxury-card rounded-sm p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-heading font-normal text-luxury-white mb-2">{vendor.name}</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-luxury-gold px-2 py-1 rounded-sm border border-luxury-gold/30">
                    {vendor.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} strokeWidth={1.5} className="text-luxury-gold fill-luxury-gold" />
                    <span className="text-sm text-luxury-white">{vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base font-light text-luxury-white/80 leading-relaxed mb-4">
              {vendor.description}
            </p>

            {vendor.services && vendor.services.length > 0 && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.map((service, idx) => (
                    <span key={idx} className="text-xs text-luxury-white/60 px-2 py-1 rounded-sm bg-luxury-surface">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-luxury-border-subtle flex items-center justify-between">
              {vendor.contact && (
                <div className="flex items-center space-x-2 text-luxury-white/60">
                  <Phone size={14} strokeWidth={1.5} />
                  <span className="text-sm">{vendor.contact}</span>
                </div>
              )}
              <button data-testid={`book-vendor-${vendor.id}`} className="luxury-button-primary px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-sm">
                Book Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-16">
          <p className="text-luxury-white/40 text-sm uppercase tracking-[0.2em]">No vendors found</p>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;