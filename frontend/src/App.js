import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import ComingSoon from './pages/ComingSoon';
import Dashboard from './pages/Dashboard';
import EstatesPage from './pages/EstatesPage';
import EstateDetailPage from './pages/EstateDetailPage';
import StaffPage from './pages/StaffPage';
import VendorsPage from './pages/VendorsPage';
import LifestylePage from './pages/LifestylePage';
import MessagingPage from './pages/MessagingPage';
import SettingsPage from './pages/SettingsPage';

const previewUser = {
  name: 'Preview Guest',
  email: 'preview@neapolitanconcierge.com',
  role: 'Estate Director',
};

function AppPreview() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }

    return () => document.body.classList.remove('light');
  }, [theme]);

  return (
    <DashboardLayout
      user={previewUser}
      onLogout={() => window.location.assign('/')}
      theme={theme}
      setTheme={setTheme}
      basePath="/app-preview"
    >
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="estates" element={<EstatesPage />} />
        <Route path="estates/:id" element={<EstateDetailPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="lifestyle" element={<LifestylePage />} />
        <Route path="messages" element={<MessagingPage />} />
        <Route path="settings" element={<SettingsPage user={previewUser} />} />
        <Route path="*" element={<Navigate to="/app-preview" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComingSoon />} />
        <Route path="/app-preview/*" element={<AppPreview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
