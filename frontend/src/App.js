import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import EstatesPage from './pages/EstatesPage';
import EstateDetailPage from './pages/EstateDetailPage';
import StaffPage from './pages/StaffPage';
import VendorsPage from './pages/VendorsPage';
import LifestylePage from './pages/LifestylePage';
import MessagingPage from './pages/MessagingPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const token = localStorage.getItem('neapolitan_token');
    const savedUser = localStorage.getItem('neapolitan_user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('neapolitan_token', token);
    localStorage.setItem('neapolitan_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('neapolitan_token');
    localStorage.removeItem('neapolitan_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            !isAuthenticated ? (
              <AuthPage onLogin={handleLogin} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <DashboardLayout 
                user={user} 
                onLogout={handleLogout}
                theme={theme}
                setTheme={setTheme}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/estates" element={<EstatesPage />} />
                  <Route path="/estates/:id" element={<EstateDetailPage />} />
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/vendors" element={<VendorsPage />} />
                  <Route path="/lifestyle" element={<LifestylePage />} />
                  <Route path="/messages" element={<MessagingPage />} />
                  <Route path="/settings" element={<SettingsPage user={user} />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;