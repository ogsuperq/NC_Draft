import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LayoutDashboard, Home, Users, Briefcase, Calendar, MessageSquare, Settings, LogOut, Sun, Moon, Sparkles } from 'lucide-react';
import AIAssistant from './AIAssistant';

const DashboardLayout = ({ children, user, onLogout, theme, setTheme, basePath = '' }) => {
  const location = useLocation();
  const [showAI, setShowAI] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: basePath, icon: LayoutDashboard },
    { name: 'Estates', path: `${basePath}/estates`, icon: Home },
    { name: 'Staff', path: `${basePath}/staff`, icon: Users },
    { name: 'Vendors', path: `${basePath}/vendors`, icon: Briefcase },
    { name: 'Lifestyle', path: `${basePath}/lifestyle`, icon: Calendar },
    { name: 'Messages', path: `${basePath}/messages`, icon: MessageSquare },
    { name: 'Settings', path: `${basePath}/settings`, icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r" style={{ background: '#0A0A0A', borderColor: 'rgba(198, 169, 107, 0.15)' }}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-8 border-b" style={{ borderColor: 'rgba(198, 169, 107, 0.15)' }}>
            <div className="flex items-center space-x-3">
              <Building2 size={24} strokeWidth={1.5} className="text-luxury-gold" />
              <div>
                <h1 className="text-xl font-heading font-light text-luxury-white">Neapolitan</h1>
                <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40">Estate Office</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-sm luxury-transition ${
                    isActive
                      ? 'bg-luxury-surface border border-luxury-border-active text-luxury-gold'
                      : 'text-luxury-white/60 hover:text-luxury-white hover:bg-luxury-surface'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="text-sm font-light tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* AI Assistant Button */}
          <div className="p-6 border-t" style={{ borderColor: 'rgba(198, 169, 107, 0.15)' }}>
            <button
              data-testid="ai-assistant-toggle"
              onClick={() => setShowAI(!showAI)}
              className="luxury-button-secondary w-full py-3 flex items-center justify-center space-x-2 rounded-sm"
            >
              <Sparkles size={16} strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-[0.2em]">AI Assistant</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="p-6 border-t" style={{ borderColor: 'rgba(198, 169, 107, 0.15)' }}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center">
                <span className="text-luxury-black font-medium text-sm">{user?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-luxury-white truncate">{user?.name}</p>
                <p className="text-xs text-luxury-white/40 uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                data-testid="theme-toggle-button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-sm hover:bg-luxury-surface luxury-transition"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={18} strokeWidth={1.5} className="text-luxury-white/60" />
                ) : (
                  <Moon size={18} strokeWidth={1.5} className="text-luxury-black/60" />
                )}
              </button>
              <button
                data-testid="logout-button"
                onClick={onLogout}
                className="p-2 rounded-sm hover:bg-luxury-surface luxury-transition"
                title="Logout"
              >
                <LogOut size={18} strokeWidth={1.5} className="text-luxury-white/60" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={{ background: '#0A0A0A' }}>
        {children}
      </main>

      {/* AI Assistant Panel */}
      {showAI && <AIAssistant onClose={() => setShowAI(false)} />}
    </div>
  );
};

export default DashboardLayout;
