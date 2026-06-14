import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, User } from 'lucide-react';
import { previewStaff } from '../lib/previewData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    if (!BACKEND_URL) {
      setStaff(previewStaff);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API}/staff`);
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = ['all', ...new Set(staff.map(s => s.role))];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
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
          Staff Directory
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60 mt-2">
          {staff.length} Team Members
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} strokeWidth={1.5} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-white/40" />
          <input
            data-testid="staff-search-input"
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="luxury-input w-full py-3 pl-10 pr-4 rounded-sm bg-luxury-surface"
          />
        </div>

        {/* Role Filter */}
        <div data-testid="role-filter" className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <button
              key={role}
              data-testid={`role-filter-${role.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-sm luxury-transition ${
                roleFilter === role
                  ? 'luxury-button-primary'
                  : 'luxury-button-secondary'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div key={member.id} data-testid={`staff-member-${member.id}`} className="luxury-card rounded-sm p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-luxury-gold flex items-center justify-center flex-shrink-0">
                <span className="text-luxury-black font-medium text-lg">{member.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-heading font-normal text-luxury-white mb-1">{member.name}</h3>
                <p className="text-sm text-luxury-white/60 mb-2">{member.role}</p>
                <span className={`inline-block text-xs uppercase tracking-wider px-2 py-1 rounded-sm ${
                  member.status === 'on-duty' ? 'bg-green-500/20 text-green-400' : 'bg-luxury-surface text-luxury-white/40'
                }`}>
                  {member.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-luxury-border-subtle space-y-2">
              {member.estate && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40">Assigned Estate</p>
                  <p className="text-sm text-luxury-white mt-1">{member.estate}</p>
                </div>
              )}
              {member.contact && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40">Contact</p>
                  <p className="text-sm text-luxury-white mt-1">{member.contact}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-16">
          <p className="text-luxury-white/40 text-sm uppercase tracking-[0.2em]">No staff members found</p>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
