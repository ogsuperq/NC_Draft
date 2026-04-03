import React, { useState } from 'react';
import axios from 'axios';
import { Building2, Shield } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: '#0A0A0A' }}>
      <div className="w-full max-w-md space-y-8 fade-in">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Building2 size={32} strokeWidth={1.5} className="text-luxury-gold" />
            <h1 className="text-4xl font-heading font-light tracking-tight text-luxury-white">
              Neapolitan
            </h1>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-luxury-white/60">
            Concierge Command
          </p>
        </div>

        {/* Login Form */}
        <div className="luxury-card rounded-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-luxury-gold">
              <Shield size={16} strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-[0.2em]">Private Access</span>
            </div>
            <h2 className="text-xl font-heading font-normal text-luxury-white">Welcome Back</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-luxury-white/60">Email</label>
              <input
                data-testid="login-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="luxury-input w-full py-3 px-0 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-luxury-white/60">Password</label>
              <input
                data-testid="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="luxury-input w-full py-3 px-0 text-base"
                required
              />
            </div>

            {error && (
              <div data-testid="login-error-message" className="text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              data-testid="login-submit-button"
              type="submit"
              disabled={loading}
              className="luxury-button-primary w-full py-3 text-sm uppercase tracking-[0.2em] font-medium rounded-sm"
            >
              {loading ? 'Authenticating...' : 'Enter'}
            </button>
          </form>

          {/* Quick Access */}
          <div className="pt-4 border-t border-luxury-border-subtle">
            <p className="text-xs uppercase tracking-[0.2em] text-luxury-white/40 text-center mb-3">Quick Access (Demo)</p>
            <div className="space-y-2">
              <button
                data-testid="quick-login-client-button"
                onClick={() => quickLogin('client@neapolitan.com')}
                className="luxury-button-secondary w-full py-2 text-xs uppercase tracking-[0.2em] rounded-sm"
              >
                Client Access
              </button>
              <button
                data-testid="quick-login-director-button"
                onClick={() => quickLogin('director@neapolitan.com')}
                className="luxury-button-secondary w-full py-2 text-xs uppercase tracking-[0.2em] rounded-sm"
              >
                Estate Director
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-luxury-white/30 uppercase tracking-[0.2em]">
          Invite-Only Platform
        </p>
      </div>
    </div>
  );
};

export default AuthPage;