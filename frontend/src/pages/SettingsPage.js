import React, { useState } from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';

const SettingsPage = ({ user }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    maintenance: true,
    events: true,
    staff: false
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-12 space-y-8 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-light tracking-tight text-luxury-white">
          Settings
        </h1>
        <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60 mt-2">
          Account & Preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile */}
        <div className="lg:col-span-2 space-y-8">
          <div data-testid="profile-section" className="luxury-card rounded-sm p-8">
            <div className="flex items-center space-x-3 mb-6">
              <User size={20} strokeWidth={1.5} className="text-luxury-gold" />
              <h2 className="text-2xl font-heading font-normal text-luxury-white">Profile Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-luxury-gold flex items-center justify-center">
                  <span className="text-luxury-black font-medium text-2xl">{user?.name?.charAt(0)}</span>
                </div>
                <button className="luxury-button-secondary px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-sm">
                  Change Avatar
                </button>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2 block">Full Name</label>
                <input
                  data-testid="profile-name-input"
                  type="text"
                  defaultValue={user?.name}
                  className="luxury-input w-full py-3 px-4 text-base bg-luxury-surface rounded-sm"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2 block">Email Address</label>
                <input
                  data-testid="profile-email-input"
                  type="email"
                  defaultValue={user?.email}
                  className="luxury-input w-full py-3 px-4 text-base bg-luxury-surface rounded-sm"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 mb-2 block">Role</label>
                <input
                  type="text"
                  value={user?.role}
                  disabled
                  className="luxury-input w-full py-3 px-4 text-base bg-luxury-surface rounded-sm opacity-50 cursor-not-allowed"
                />
              </div>

              <button data-testid="save-profile-button" className="luxury-button-primary px-6 py-3 text-xs uppercase tracking-[0.2em] rounded-sm">
                Save Changes
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div data-testid="notifications-section" className="luxury-card rounded-sm p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Bell size={20} strokeWidth={1.5} className="text-luxury-gold" />
              <h2 className="text-2xl font-heading font-normal text-luxury-white">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-sm border border-luxury-border-subtle">
                  <div>
                    <p className="text-base font-light text-luxury-white capitalize">{key.replace('_', ' ')}</p>
                    <p className="text-sm text-luxury-white/60 mt-1">
                      {key === 'email' && 'Receive notifications via email'}
                      {key === 'sms' && 'Receive notifications via SMS'}
                      {key === 'maintenance' && 'Alerts for property maintenance'}
                      {key === 'events' && 'Reminders for upcoming events'}
                      {key === 'staff' && 'Updates on staff activities'}
                    </p>
                  </div>
                  <button
                    data-testid={`notification-toggle-${key}`}
                    onClick={() => handleToggle(key)}
                    className={`w-12 h-6 rounded-full luxury-transition relative ${
                      value ? 'bg-luxury-gold' : 'bg-luxury-surface'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white luxury-transition ${
                      value ? 'right-1' : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-6">
          <div data-testid="security-section" className="luxury-card rounded-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield size={18} strokeWidth={1.5} className="text-luxury-gold" />
              <h3 className="text-lg font-heading font-normal text-luxury-white">Security</h3>
            </div>
            <div className="space-y-3">
              <button className="luxury-button-secondary w-full py-3 text-sm uppercase tracking-[0.2em] rounded-sm">
                Change Password
              </button>
              <button className="luxury-button-secondary w-full py-3 text-sm uppercase tracking-[0.2em] rounded-sm">
                Two-Factor Auth
              </button>
              <button className="luxury-button-secondary w-full py-3 text-sm uppercase tracking-[0.2em] rounded-sm">
                Active Sessions
              </button>
            </div>
          </div>

          <div data-testid="appearance-section" className="luxury-card rounded-sm p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette size={18} strokeWidth={1.5} className="text-luxury-gold" />
              <h3 className="text-lg font-heading font-normal text-luxury-white">Appearance</h3>
            </div>
            <p className="text-sm text-luxury-white/60 mb-4">
              Toggle between dark and light mode using the theme button in the sidebar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;