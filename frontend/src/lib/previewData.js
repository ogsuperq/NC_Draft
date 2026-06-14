export const previewEstates = [
  {
    id: '1',
    name: 'Villa Serenissima',
    location: 'Lake Como, Italy',
    status: 'occupied',
    image: 'https://images.pexels.com/photos/13620067/pexels-photo-13620067.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    size: '12,500 sq ft',
    maintenanceAlerts: 2,
    lastVisit: '2026-01-15',
  },
  {
    id: '2',
    name: 'Château Lumière',
    location: 'Provence, France',
    status: 'preparing',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    size: '18,000 sq ft',
    maintenanceAlerts: 0,
    lastVisit: '2025-12-20',
  },
  {
    id: '3',
    name: 'Penthouse Azure',
    location: 'Manhattan, New York',
    status: 'vacant',
    image: 'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    size: '8,200 sq ft',
    maintenanceAlerts: 1,
    lastVisit: '2025-11-05',
  },
];

export const previewStaff = [
  { id: '1', name: 'Jean-Pierre Dubois', role: 'Executive Chef', status: 'on-duty', estate: 'Villa Serenissima', contact: '+39 340 123 4567' },
  { id: '2', name: 'Elena Rodriguez', role: 'House Manager', status: 'on-duty', estate: 'Château Lumière', contact: '+33 6 12 34 56 78' },
  { id: '3', name: 'Marcus Williams', role: 'Head of Security', status: 'on-duty', estate: 'Villa Serenissima', contact: '+39 340 987 6543' },
  { id: '4', name: 'Sophie Laurent', role: 'Private Butler', status: 'off-duty', estate: 'Penthouse Azure', contact: '+1 212 555 0123' },
];

export const previewVendors = [
  { id: '1', name: 'Prestige Maintenance Group', category: 'Maintenance', rating: 4.9, description: 'Elite property maintenance and restoration services', contact: '+1 800 PRESTIGE', services: ['HVAC', 'Plumbing', 'Electrical', 'Landscaping'] },
  { id: '2', name: 'Guardian Security Elite', category: 'Security', rating: 5.0, description: 'Discreet executive protection and estate security', contact: '+1 800 GUARDIAN', services: ['24/7 Monitoring', 'Personal Security', 'Cyber Security'] },
  { id: '3', name: 'Atelier Events', category: 'Events', rating: 4.8, description: 'Bespoke event planning and concierge services', contact: '+33 1 45 67 89 00', services: ['Event Planning', 'Catering', 'Entertainment'] },
  { id: '4', name: 'Saveur Privé Catering', category: 'Hospitality', rating: 4.9, description: 'Michelin-star private dining experiences', contact: '+39 02 1234 5678', services: ['Private Chef', 'Wine Pairing', 'Menu Design'] },
];

export const previewEvents = [
  { id: '1', title: 'Villa Serenissima Guest Arrival', date: '2026-07-10', type: 'guest', estate: 'Villa Serenissima', description: 'Weekend arrival and residence preparation' },
  { id: '2', title: 'Foundation Dinner', date: '2026-08-15', type: 'event', estate: 'Château Lumière', description: 'Private dinner for eighty guests' },
  { id: '3', title: 'Aspen Summer Retreat', date: '2026-07-28', type: 'travel', description: 'Week-long stay at a private residence' },
];

export const previewMessages = [
  {
    id: '1',
    from_user: 'Victoria Chen',
    to_user: 'Alexander Sterling',
    content: 'Villa Serenissima is fully prepared for Friday’s arrival.',
    timestamp: '2026-06-13T16:30:00.000Z',
  },
  {
    id: '2',
    from_user: 'Alexander Sterling',
    to_user: 'Victoria Chen',
    content: 'Excellent. Please confirm the airport transfer with the family office.',
    timestamp: '2026-06-13T16:42:00.000Z',
  },
];
