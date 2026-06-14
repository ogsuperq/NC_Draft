import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Home as HomeIcon, AlertCircle, TrendingUp } from 'lucide-react';
import { previewEstates, previewStaff } from '../lib/previewData';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EstateDetailPage = () => {
  const { id } = useParams();
  const [estate, setEstate] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEstateDetails = useCallback(async () => {
    if (!BACKEND_URL) {
      const previewEstate = previewEstates.find((item) => item.id === id);
      setEstate(previewEstate || null);
      setStaff(previewStaff.filter((member) => member.estate === previewEstate?.name));
      setLoading(false);
      return;
    }

    try {
      const [estateRes, staffRes] = await Promise.all([
        axios.get(`${API}/estates/${id}`),
        axios.get(`${API}/staff`)
      ]);
      setEstate(estateRes.data);
      setStaff(staffRes.data.filter(s => s.estate === estateRes.data.name));
    } catch (error) {
      console.error('Error fetching estate details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEstateDetails();
  }, [fetchEstateDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-luxury-white/60 text-sm uppercase tracking-[0.2em]">Loading...</p>
      </div>
    );
  }

  if (!estate) {
    return (
      <div className="p-12">
        <p className="text-luxury-white/60">Estate not found</p>
      </div>
    );
  }

  const statusColors = {
    occupied: 'bg-green-500/20 text-green-400',
    preparing: 'bg-yellow-500/20 text-yellow-400',
    vacant: 'bg-luxury-surface text-luxury-white/40'
  };

  return (
    <div className="fade-in">
      {/* Hero Image */}
      <div className="relative h-96">
        <img
          src={estate.image}
          alt={estate.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Back Button */}
        <Link 
          to="/app-preview/estates"
          data-testid="back-to-estates-button"
          className="absolute top-8 left-8 flex items-center space-x-2 luxury-button-secondary px-4 py-2 rounded-sm"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          <span className="text-xs uppercase tracking-[0.2em]">Back to Estates</span>
        </Link>

        {/* Estate Name */}
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl sm:text-5xl font-heading font-light tracking-tight text-white mb-2">
            {estate.name}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/80">
              <MapPin size={16} strokeWidth={1.5} />
              <span className="text-sm">{estate.location}</span>
            </div>
            <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-sm ${statusColors[estate.status]}`}>
              {estate.status}
            </span>
          </div>
        </div>
      </div>

      <div className="p-12 space-y-8">
        {/* Maintenance Alerts */}
        {estate.maintenanceAlerts > 0 && (
          <div data-testid="estate-maintenance-alerts" className="luxury-card rounded-sm p-6 border-red-400/30">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} strokeWidth={1.5} className="text-red-400" />
              <div>
                <h3 className="text-sm uppercase tracking-[0.2em] text-red-400 mb-1">Maintenance Required</h3>
                <p className="text-base font-light text-luxury-white">{estate.maintenanceAlerts} active alert{estate.maintenanceAlerts > 1 ? 's' : ''} requiring attention</p>
              </div>
            </div>
          </div>
        )}

        {/* Estate Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div data-testid="estate-details-section" className="lg:col-span-2 space-y-8">
            <div className="luxury-card rounded-sm p-8">
              <h2 className="text-2xl font-heading font-normal text-luxury-white mb-6">Estate Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2">Property Size</p>
                  <p className="text-lg text-luxury-white">{estate.size}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2">Last Visit</p>
                  <p className="text-lg text-luxury-white">{new Date(estate.lastVisit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2">Status</p>
                  <p className="text-lg text-luxury-white capitalize">{estate.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2">Maintenance Alerts</p>
                  <p className="text-lg text-luxury-white">{estate.maintenanceAlerts}</p>
                </div>
              </div>
            </div>

            {/* Assigned Staff */}
            <div data-testid="assigned-staff-section" className="luxury-card rounded-sm p-8">
              <h2 className="text-2xl font-heading font-normal text-luxury-white mb-6">Assigned Staff</h2>
              {staff.length > 0 ? (
                <div className="space-y-4">
                  {staff.map((member) => (
                    <div key={member.id} data-testid={`assigned-staff-${member.id}`} className="flex items-center justify-between p-4 rounded-sm border border-luxury-border-subtle">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center">
                          <span className="text-luxury-black font-medium">{member.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-light text-luxury-white">{member.name}</h3>
                          <p className="text-sm text-luxury-white/60">{member.role}</p>
                        </div>
                      </div>
                      <span className={`text-xs uppercase tracking-wider px-3 py-1 rounded-sm ${
                        member.status === 'on-duty' ? 'bg-green-500/20 text-green-400' : 'bg-luxury-surface text-luxury-white/40'
                      }`}>
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-luxury-white/40 text-center py-8">No staff currently assigned</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div data-testid="quick-actions-section" className="luxury-card rounded-sm p-6">
              <h3 className="text-lg font-heading font-normal text-luxury-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button data-testid="schedule-maintenance-button" className="luxury-button-secondary w-full py-3 text-sm uppercase tracking-[0.2em] rounded-sm">
                  Schedule Maintenance
                </button>
                <button data-testid="update-status-button" className="luxury-button-secondary w-full py-3 text-sm uppercase tracking-[0.2em] rounded-sm">
                  Update Status
                </button>
                <button data-testid="view-inventory-button" className="luxury-button-secondary w-full py-3 text-sm uppercase tracking-[0.2em] rounded-sm">
                  View Inventory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstateDetailPage;
