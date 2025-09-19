const { useState, useEffect, useRef } = React;

// Hardcoded data for Indian tourism
const DATA = {
  tourists: [
    {
      id: "T001",
      name: "John Smith",
      nationality: "USA",
      age: 32,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: "India Gate, New Delhi"
      },
      status: "safe",
      checkInTime: "2025-09-20T10:30:00",
      emergencyContact: "+1-555-0123",
      digitalId: "0x7b8a9c2e3f4d5e6f7a8b9c0d1e2f3a4b",
      medicalConditions: "None",
      riskScore: 85,
      itinerary: ["Red Fort", "Qutub Minar", "Lotus Temple"]
    },
    {
      id: "T002",
      name: "Emma Johnson",
      nationality: "UK",
      age: 28,
      location: {
        lat: 27.1751,
        lng: 78.0421,
        address: "Taj Mahal, Agra"
      },
      status: "emergency",
      checkInTime: "2025-09-20T09:15:00",
      emergencyContact: "+44-20-7946-0958",
      digitalId: "0xa1b2c3d4e5f6789012345678901234567890",
      medicalConditions: "Diabetes",
      riskScore: 65,
      itinerary: ["Taj Mahal", "Agra Fort", "Mehtab Bagh"]
    },
    {
      id: "T003",
      name: "Hiroshi Tanaka",
      nationality: "Japan",
      age: 45,
      location: {
        lat: 26.9124,
        lng: 75.7873,
        address: "Hawa Mahal, Jaipur"
      },
      status: "caution",
      checkInTime: "2025-09-20T08:45:00",
      emergencyContact: "+81-3-1234-5678",
      digitalId: "0x1a2b3c4d5e6f7890abcdef1234567890",
      medicalConditions: "Hypertension",
      riskScore: 70,
      itinerary: ["City Palace", "Jantar Mantar", "Amber Fort"]
    },
    {
      id: "T004",
      name: "Maria Garcia",
      nationality: "Spain",
      age: 35,
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: "Gateway of India, Mumbai"
      },
      status: "safe",
      checkInTime: "2025-09-20T11:20:00",
      emergencyContact: "+34-91-123-4567",
      digitalId: "0xfedcba0987654321abcdef1234567890",
      medicalConditions: "None",
      riskScore: 90,
      itinerary: ["Marine Drive", "Elephanta Caves", "Chhatrapati Shivaji Terminus"]
    },
    {
      id: "T005",
      name: "David Wilson",
      nationality: "Australia",
      age: 29,
      location: {
        lat: 15.2993,
        lng: 74.1240,
        address: "Panaji, Goa"
      },
      status: "check-in",
      checkInTime: "2025-09-20T07:30:00",
      emergencyContact: "+61-2-9876-5432",
      digitalId: "0x123456789abcdef0123456789abcdef0",
      medicalConditions: "Asthma",
      riskScore: 75,
      itinerary: ["Baga Beach", "Basilica of Bom Jesus", "Dudhsagar Falls"]
    }
  ],
  alerts: [
    {
      id: "A001",
      touristId: "T002",
      touristName: "Emma Johnson",
      type: "Medical Emergency",
      priority: "critical",
      location: "Taj Mahal, Agra",
      timestamp: "2025-09-20T14:30:00",
      status: "active",
      description: "Tourist collapsed near Taj Mahal entrance, medical assistance required",
      responseTeam: "Team Alpha",
      coordinates: { lat: 27.1751, lng: 78.0421 }
    },
    {
      id: "A002",
      touristId: "T003",
      touristName: "Hiroshi Tanaka",
      type: "Safety Concern",
      priority: "medium",
      location: "Hawa Mahal, Jaipur",
      timestamp: "2025-09-20T13:15:00",
      status: "investigating",
      description: "Tourist reported feeling unwell, monitoring vitals",
      responseTeam: "Team Beta",
      coordinates: { lat: 26.9124, lng: 75.7873 }
    },
    {
      id: "A003",
      touristId: "T001",
      touristName: "John Smith",
      type: "Lost Tourist",
      priority: "low",
      location: "India Gate, New Delhi",
      timestamp: "2025-09-20T12:45:00",
      status: "resolved",
      description: "Tourist lost contact, found safe at nearby restaurant",
      responseTeam: "Team Gamma",
      coordinates: { lat: 28.6139, lng: 77.2090 }
    }
  ],
  incidents: [
    {
      id: "FIR001",
      touristId: "T002",
      title: "Medical Emergency - Tourist Collapse",
      status: "under-investigation",
      priority: "high",
      createdAt: "2025-09-20T14:35:00",
      location: "Taj Mahal, Agra",
      officerAssigned: "Inspector Raj Sharma",
      description: "Tourist Emma Johnson collapsed near Taj Mahal entrance due to diabetic emergency",
      evidence: ["Medical report", "CCTV footage", "Witness statements"],
      category: "Medical Emergency"
    },
    {
      id: "FIR002",
      touristId: "T001",
      title: "Lost Tourist Case",
      status: "resolved",
      priority: "low",
      createdAt: "2025-09-20T12:50:00",
      location: "India Gate, New Delhi",
      officerAssigned: "Constable Priya Singh",
      description: "Tourist John Smith lost contact, later found safe",
      evidence: ["Location logs", "Restaurant CCTV"],
      category: "Missing Person"
    },
    {
      id: "FIR003",
      touristId: "T003",
      title: "Health Monitoring Alert",
      status: "pending",
      priority: "medium",
      createdAt: "2025-09-20T13:20:00",
      location: "Hawa Mahal, Jaipur",
      officerAssigned: "Sergeant Kumar Patel",
      description: "Tourist reported feeling unwell, vital signs monitoring initiated",
      evidence: ["Health monitor logs", "Medical assessment"],
      category: "Health Issue"
    }
  ],
  geoFences: [
    {
      id: "GF001",
      name: "Red Fort Restricted Area",
      type: "restricted",
      coordinates: [
        { lat: 28.6562, lng: 77.2410 },
        { lat: 28.6582, lng: 77.2430 },
        { lat: 28.6542, lng: 77.2450 },
        { lat: 28.6522, lng: 77.2400 }
      ],
      description: "Archaeological protected zone - limited access"
    },
    {
      id: "GF002",
      name: "India Gate Safe Zone",
      type: "safe",
      coordinates: [
        { lat: 28.6129, lng: 77.2070 },
        { lat: 28.6149, lng: 77.2110 },
        { lat: 28.6109, lng: 77.2130 },
        { lat: 28.6089, lng: 77.2050 }
      ],
      description: "High security tourist area with regular patrol"
    },
    {
      id: "GF003",
      name: "Taj Mahal Emergency Zone",
      type: "emergency",
      coordinates: [
        { lat: 27.1741, lng: 78.0401 },
        { lat: 27.1761, lng: 78.0441 },
        { lat: 27.1721, lng: 78.0461 },
        { lat: 27.1701, lng: 78.0381 }
      ],
      description: "Emergency services and medical facilities available"
    }
  ],
  iotDevices: [
    {
      id: "IOT001",
      touristId: "T001",
      touristName: "John Smith",
      type: "Smart Watch",
      battery: 85,
      signal: 95,
      lastSync: "2025-09-20T14:25:00",
      vitals: {
        heartRate: 72,
        temperature: 36.5,
        steps: 8542
      },
      status: "online"
    },
    {
      id: "IOT002",
      touristId: "T002",
      touristName: "Emma Johnson",
      type: "Health Monitor",
      battery: 45,
      signal: 78,
      lastSync: "2025-09-20T14:30:00",
      vitals: {
        heartRate: 120,
        temperature: 37.2,
        bloodGlucose: 180
      },
      status: "alert"
    },
    {
      id: "IOT003",
      touristId: "T003",
      touristName: "Hiroshi Tanaka",
      type: "Fitness Tracker",
      battery: 92,
      signal: 88,
      lastSync: "2025-09-20T14:20:00",
      vitals: {
        heartRate: 88,
        temperature: 36.8,
        steps: 6234
      },
      status: "online"
    }
  ],
  analytics: {
    kpis: {
      totalTourists: 1247,
      activeAlerts: 3,
      resolvedCases: 28,
      safetyScore: 82
    },
    incidentTrends: [
      { date: "2025-09-14", incidents: 5 },
      { date: "2025-09-15", incidents: 3 },
      { date: "2025-09-16", incidents: 7 },
      { date: "2025-09-17", incidents: 2 },
      { date: "2025-09-18", incidents: 4 },
      { date: "2025-09-19", incidents: 6 },
      { date: "2025-09-20", incidents: 2 }
    ],
    touristFlow: [
      { location: "New Delhi", count: 345 },
      { location: "Agra", count: 289 },
      { location: "Jaipur", count: 234 },
      { location: "Mumbai", count: 201 },
      { location: "Goa", count: 178 }
    ],
    responseMetrics: {
      avgResponseTime: 4.2,
      resolutionRate: 94.5,
      escalationRate: 8.3
    }
  },
  notifications: [
    {
      id: "N001",
      type: "emergency",
      title: "Medical Emergency Alert",
      message: "Tourist Emma Johnson requires immediate medical assistance at Taj Mahal",
      timestamp: "2025-09-20T14:30:00",
      read: false
    },
    {
      id: "N002",
      type: "system",
      title: "System Update",
      message: "IoT device monitoring system updated successfully",
      timestamp: "2025-09-20T13:00:00",
      read: true
    },
    {
      id: "N003",
      type: "alert",
      title: "Geo-fence Breach",
      message: "Tourist entered restricted area - Red Fort Archaeological Zone",
      timestamp: "2025-09-20T12:15:00",
      read: true
    }
  ]
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">×</button>
    </div>
  );
};

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Header component
const Header = ({ darkMode, toggleDarkMode, activeAlerts, notifications }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleThemeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDarkMode();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Tourist Monitoring Dashboard
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {currentTime.toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </div>
          
          <div className="relative">
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i className="fas fa-bell text-lg"></i>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>
          
          <div className="relative">
            <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <i className="fas fa-exclamation-triangle text-lg"></i>
              {activeAlerts > 0 && (
                <span className="notification-badge">
                  {activeAlerts}
                </span>
              )}
            </button>
          </div>
          
          <button 
            onClick={handleThemeToggle}
            className="theme-toggle p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar component
const Sidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'map', icon: 'fas fa-map-marked-alt', label: 'Live Map' },
    { id: 'alerts', icon: 'fas fa-exclamation-circle', label: 'SOS Alerts' },
    { id: 'tourists', icon: 'fas fa-users', label: 'Tourist Profiles' },
    { id: 'incidents', icon: 'fas fa-file-alt', label: 'Incident Management' },
    { id: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
    { id: 'geofence', icon: 'fas fa-map-marked', label: 'Geo-fence' },
    { id: 'iot', icon: 'fas fa-microchip', label: 'IoT Devices' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleCollapseToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <button 
          onClick={handleCollapseToggle}
          className="w-full flex items-center justify-center p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>
      
      <nav className="px-4 pb-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded mb-1 transition-colors ${
              activeSection === item.id 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <i className={`${item.icon} sidebar-icon ${collapsed ? 'text-center w-full' : ''}`}></i>
            {!collapsed && <span className="sidebar-text">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

// KPI Card component
const KPICard = ({ title, value, icon, color, trend }) => (
  <div className="kpi-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <i className={`fas ${trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
            {Math.abs(trend)}%
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <i className={`${icon} text-white text-lg`}></i>
      </div>
    </div>
  </div>
);

// Dashboard Overview component
const DashboardOverview = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && window.Chart) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.analytics.incidentTrends.map(d => d.date.split('-')[2]),
          datasets: [{
            label: 'Incidents',
            data: data.analytics.incidentTrends.map(d => d.incidents),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data.analytics.incidentTrends]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Tourists"
          value={data.analytics.kpis.totalTourists.toLocaleString()}
          icon="fas fa-users"
          color="bg-blue-500"
          trend={5.2}
        />
        <KPICard 
          title="Active Alerts"
          value={data.analytics.kpis.activeAlerts}
          icon="fas fa-exclamation-triangle"
          color="bg-red-500"
          trend={-12.4}
        />
        <KPICard 
          title="Resolved Cases"
          value={data.analytics.kpis.resolvedCases}
          icon="fas fa-check-circle"
          color="bg-green-500"
          trend={8.7}
        />
        <KPICard 
          title="Safety Score"
          value={`${data.analytics.kpis.safetyScore}%`}
          icon="fas fa-shield-alt"
          color="bg-purple-500"
          trend={2.1}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Incident Trends (Last 7 Days)</h3>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activities</h3>
          <div className="space-y-3">
            {data.notifications.slice(0, 5).map(notification => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <i className={`fas ${
                  notification.type === 'emergency' ? 'fa-exclamation-circle text-red-500' :
                  notification.type === 'system' ? 'fa-cog text-blue-500' :
                  'fa-bell text-yellow-500'
                } mt-1`}></i>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Live Map component - Fixed version without Google Maps callback
const LiveMap = ({ data, showToast }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showLayers, setShowLayers] = useState({
    tourists: true,
    heatmap: false,
    geofences: true
  });

  useEffect(() => {
    // Initialize map placeholder without Google Maps API callback issues
    if (mapRef.current && !mapLoaded) {
      // Create a comprehensive map visualization
      mapRef.current.innerHTML = `
        <div class="flex flex-col h-full bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div class="bg-blue-600 text-white p-3 text-center font-semibold">
            <i class="fas fa-map-marked-alt mr-2"></i>
            Live Tourist Tracking - India
          </div>
          <div class="flex-1 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div class="bg-white dark:bg-gray-600 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-800 dark:text-white mb-3">Tourist Locations</h4>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  ${data.tourists.map(t => `
                    <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full ${
                          t.status === 'safe' ? 'bg-green-500' :
                          t.status === 'emergency' ? 'bg-red-500' :
                          t.status === 'caution' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }"></div>
                        <span class="font-medium text-gray-800 dark:text-white">${t.name}</span>
                      </div>
                      <span class="text-gray-600 dark:text-gray-300 text-xs">${t.location.address.split(',')[0]}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="bg-white dark:bg-gray-600 p-4 rounded-lg">
                <h4 class="font-semibold text-gray-800 dark:text-white mb-3">Geo-fence Zones</h4>
                <div class="space-y-2">
                  ${data.geoFences.map(fence => `
                    <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 rounded-full ${
                          fence.type === 'safe' ? 'bg-green-500' :
                          fence.type === 'restricted' ? 'bg-red-500' :
                          'bg-orange-500'
                        }"></div>
                        <span class="font-medium text-gray-800 dark:text-white">${fence.name}</span>
                      </div>
                      <span class="text-gray-600 dark:text-gray-300 text-xs capitalize">${fence.type}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-200 dark:bg-gray-800 p-3 text-center">
            <div class="flex justify-center space-x-6 text-sm">
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">Safe: ${data.tourists.filter(t => t.status === 'safe').length}</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">Emergency: ${data.tourists.filter(t => t.status === 'emergency').length}</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span class="text-gray-700 dark:text-gray-300">Caution: ${data.tourists.filter(t => t.status === 'caution').length}</span>
              </div>
            </div>
          </div>
        </div>
      `;
      setMapLoaded(true);
    }
  }, [mapLoaded, data]);

  const handleLayerChange = (layer) => {
    setShowLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    showToast(`${layer} layer ${showLayers[layer] ? 'hidden' : 'shown'}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Tourist Map</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="tourists-layer"
              checked={showLayers.tourists}
              onChange={() => handleLayerChange('tourists')}
              className="rounded"
            />
            <label htmlFor="tourists-layer" className="text-sm text-gray-700 dark:text-gray-300">Show Tourists</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="heatmap-layer"
              checked={showLayers.heatmap}
              onChange={() => handleLayerChange('heatmap')}
              className="rounded"
            />
            <label htmlFor="heatmap-layer" className="text-sm text-gray-700 dark:text-gray-300">Heatmap</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="geofences-layer"
              checked={showLayers.geofences}
              onChange={() => handleLayerChange('geofences')}
              className="rounded"
            />
            <label htmlFor="geofences-layer" className="text-sm text-gray-700 dark:text-gray-300">Geo-fences</label>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="map-container">
          <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-green-800 dark:text-green-200">Safe</p>
          <p className="text-lg font-bold text-green-900 dark:text-green-100">{data.tourists.filter(t => t.status === 'safe').length}</p>
        </div>
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-center">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Caution</p>
          <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{data.tourists.filter(t => t.status === 'caution').length}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-red-800 dark:text-red-200">Emergency</p>
          <p className="text-lg font-bold text-red-900 dark:text-red-100">{data.tourists.filter(t => t.status === 'emergency').length}</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Check-in</p>
          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{data.tourists.filter(t => t.status === 'check-in').length}</p>
        </div>
      </div>
    </div>
  );
};

// SOS Alerts component
const SOSAlerts = ({ data, showToast }) => {
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = data.alerts.filter(alert => {
    if (filterPriority !== 'all' && alert.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false;
    return true;
  });

  const handleRespond = (alertId) => {
    showToast('Response team assigned successfully', 'success');
  };

  const handleEscalate = (alertId) => {
    showToast('Alert escalated to higher authority', 'warning');
  };

  const handleResolve = (alertId) => {
    showToast('Alert marked as resolved', 'success');
  };

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'bg-orange-50 dark:bg-orange-900 border-l-orange-500';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SOS Alerts Management</h2>
        <div className="flex items-center space-x-4">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className={`alert-card p-6 rounded-lg border bg-white dark:bg-gray-800 ${getPriorityClass(alert.priority)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {alert.type}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alert.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    alert.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {alert.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alert.status === 'active' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tourist</p>
                    <p className="font-medium text-gray-900 dark:text-white">{alert.touristName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{alert.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Response Team</p>
                    <p className="font-medium text-gray-900 dark:text-white">{alert.responseTeam}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">{alert.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleRespond(alert.id)}
                className="btn btn--primary btn--sm"
                disabled={alert.status === 'resolved'}
              >
                <i className="fas fa-play mr-2"></i>
                Respond
              </button>
              <button
                onClick={() => handleEscalate(alert.id)}
                className="btn btn--secondary btn--sm"
                disabled={alert.status === 'resolved'}
              >
                <i className="fas fa-arrow-up mr-2"></i>
                Escalate
              </button>
              <button
                onClick={() => handleResolve(alert.id)}
                className="btn btn--outline btn--sm"
                disabled={alert.status === 'resolved'}
              >
                <i className="fas fa-check mr-2"></i>
                Resolve
              </button>
              <button
                onClick={() => handleViewDetails(alert)}
                className="btn btn--outline btn--sm"
              >
                <i className="fas fa-eye mr-2"></i>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="Alert Details"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alert ID</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedAlert.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tourist ID</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedAlert.touristId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Coordinates</label>
                <p className="text-gray-900 dark:text-gray-100">
                  {selectedAlert.coordinates.lat.toFixed(4)}, {selectedAlert.coordinates.lng.toFixed(4)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Response Team</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedAlert.responseTeam}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Description</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                {selectedAlert.description}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Tourist Profiles component
const TouristProfiles = ({ data, showToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTourists = data.tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.digitalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tourist.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const generateQRCode = (touristId) => {
    showToast('QR Code generated successfully', 'success');
  };

  const handleViewProfile = (tourist) => {
    setSelectedTourist(tourist);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tourist Profiles</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search tourists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="safe">Safe</option>
            <option value="caution">Caution</option>
            <option value="emergency">Emergency</option>
            <option value="check-in">Check-in</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTourists.map(tourist => (
          <div key={tourist.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-gray-600 dark:text-gray-300"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{tourist.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tourist.nationality}</p>
                </div>
              </div>
              <span className={`status-badge status-${tourist.status}`}>
                {tourist.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Age:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{tourist.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Risk Score:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{tourist.riskScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
                <span className="text-sm font-medium text-right text-gray-900 dark:text-white">{tourist.location.address}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewProfile(tourist)}
                className="btn btn--primary btn--sm flex-1"
              >
                <i className="fas fa-eye mr-2"></i>
                View Profile
              </button>
              <button
                onClick={() => generateQRCode(tourist.id)}
                className="btn btn--outline btn--sm"
              >
                <i className="fas fa-qrcode"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedTourist}
        onClose={() => setSelectedTourist(null)}
        title="Tourist Profile Details"
      >
        {selectedTourist && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <i className="fas fa-user text-gray-600 dark:text-gray-300 text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedTourist.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedTourist.nationality} • {selectedTourist.age} years old</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Digital ID</label>
                <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-white">{selectedTourist.digitalId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedTourist.emergencyContact}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check-in Time</label>
                <p className="text-gray-900 dark:text-gray-100">{new Date(selectedTourist.checkInTime).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Risk Score</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedTourist.riskScore}%</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Medical Conditions</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                {selectedTourist.medicalConditions}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Travel Itinerary</label>
              <div className="space-y-2">
                {selectedTourist.itinerary.map((place, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <i className="fas fa-map-marker-alt text-blue-500"></i>
                    <span className="text-gray-900 dark:text-white">{place}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Location</label>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                <p className="font-medium text-gray-900 dark:text-white">{selectedTourist.location.address}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Coordinates: {selectedTourist.location.lat.toFixed(4)}, {selectedTourist.location.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Incident Management component
const IncidentManagement = ({ data, showToast }) => {
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [newIncident, setNewIncident] = useState({
    touristId: '',
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  const kanbanColumns = {
    'pending': { 
      title: 'Pending', 
      incidents: data.incidents.filter(i => i.status === 'pending'),
      color: 'bg-gray-100 dark:bg-gray-700'
    },
    'under-investigation': { 
      title: 'Under Investigation', 
      incidents: data.incidents.filter(i => i.status === 'under-investigation'),
      color: 'bg-yellow-100 dark:bg-yellow-900'
    },
    'resolved': { 
      title: 'Resolved', 
      incidents: data.incidents.filter(i => i.status === 'resolved'),
      color: 'bg-green-100 dark:bg-green-900'
    }
  };

  const handleCreateIncident = (e) => {
    e.preventDefault();
    showToast('Incident report created successfully', 'success');
    setShowNewIncidentModal(false);
    setNewIncident({
      touristId: '',
      title: '',
      description: '',
      category: '',
      priority: 'medium'
    });
  };

  const handleGenerateReport = (incidentId) => {
    showToast('PDF report generated successfully', 'success');
  };

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Incident Management</h2>
        <button
          onClick={() => setShowNewIncidentModal(true)}
          className="btn btn--primary"
        >
          <i className="fas fa-plus mr-2"></i>
          New Incident Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(kanbanColumns).map(([status, column]) => (
          <div key={status} className={`kanban-column ${column.color} rounded-lg p-4`}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {column.title} ({column.incidents.length})
            </h3>
            <div className="space-y-3">
              {column.incidents.map(incident => (
                <div key={incident.id} className="kanban-card bg-white dark:bg-gray-800">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">{incident.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      incident.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      incident.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {incident.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{incident.category}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{incident.location}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Officer: {incident.officerAssigned}</span>
                    <button
                      onClick={() => handleViewIncident(incident)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Incident Modal */}
      <Modal
        isOpen={showNewIncidentModal}
        onClose={() => setShowNewIncidentModal(false)}
        title="Create New Incident Report"
      >
        <form onSubmit={handleCreateIncident} className="space-y-4">
          <div>
            <label className="form-label">Tourist</label>
            <select
              value={newIncident.touristId}
              onChange={(e) => setNewIncident(prev => ({ ...prev, touristId: e.target.value }))}
              className="form-control"
              required
            >
              <option value="">Select Tourist</option>
              {data.tourists.map(tourist => (
                <option key={tourist.id} value={tourist.id}>
                  {tourist.name} ({tourist.nationality})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Incident Title</label>
            <input
              type="text"
              value={newIncident.title}
              onChange={(e) => setNewIncident(prev => ({ ...prev, title: e.target.value }))}
              className="form-control"
              required
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              value={newIncident.category}
              onChange={(e) => setNewIncident(prev => ({ ...prev, category: e.target.value }))}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Missing Person">Missing Person</option>
              <option value="Safety Concern">Safety Concern</option>
              <option value="Theft">Theft</option>
              <option value="Accident">Accident</option>
            </select>
          </div>

          <div>
            <label className="form-label">Priority</label>
            <select
              value={newIncident.priority}
              onChange={(e) => setNewIncident(prev => ({ ...prev, priority: e.target.value }))}
              className="form-control"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              value={newIncident.description}
              onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
              className="form-control"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="flex items-center space-x-3">
            <button type="submit" className="btn btn--primary">
              <i className="fas fa-save mr-2"></i>
              Create Report
            </button>
            <button
              type="button"
              onClick={() => setShowNewIncidentModal(false)}
              className="btn btn--secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Incident Details Modal */}
      <Modal
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        title="Incident Details"
      >
        {selectedIncident && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Incident ID</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedIncident.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{selectedIncident.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <p className="text-gray-900 dark:text-gray-100 capitalize">{selectedIncident.priority}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Officer Assigned</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedIncident.officerAssigned}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                {selectedIncident.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evidence</label>
              <div className="space-y-2">
                {selectedIncident.evidence.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <i className="fas fa-file text-blue-500"></i>
                    <span className="text-gray-900 dark:text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleGenerateReport(selectedIncident.id)}
                className="btn btn--primary"
              >
                <i className="fas fa-download mr-2"></i>
                Generate PDF Report
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Analytics component
const Analytics = ({ data }) => {
  const trendChartRef = useRef(null);
  const flowChartRef = useRef(null);
  const trendChartInstance = useRef(null);
  const flowChartInstance = useRef(null);

  useEffect(() => {
    if (window.Chart) {
      // Incident trends chart
      if (trendChartRef.current) {
        if (trendChartInstance.current) {
          trendChartInstance.current.destroy();
        }

        const ctx = trendChartRef.current.getContext('2d');
        trendChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.analytics.incidentTrends.map(d => d.date.split('-')[2]),
            datasets: [{
              label: 'Daily Incidents',
              data: data.analytics.incidentTrends.map(d => d.incidents),
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Incident Trends (Last 7 Days)'
              }
            }
          }
        });
      }

      // Tourist flow chart
      if (flowChartRef.current) {
        if (flowChartInstance.current) {
          flowChartInstance.current.destroy();
        }

        const ctx = flowChartRef.current.getContext('2d');
        flowChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: data.analytics.touristFlow.map(d => d.location),
            datasets: [{
              data: data.analytics.touristFlow.map(d => d.count),
              backgroundColor: [
                '#1FB8CD',
                '#FFC185',
                '#B4413C',
                '#ECEBD5',
                '#5D878F'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Tourist Distribution by Location'
              }
            }
          }
        });
      }
    }

    return () => {
      if (trendChartInstance.current) {
        trendChartInstance.current.destroy();
      }
      if (flowChartInstance.current) {
        flowChartInstance.current.destroy();
      }
    };
  }, [data]);

  const handleGenerateReport = (type) => {
    alert(`${type} report generated successfully`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {data.analytics.responseMetrics.avgResponseTime} min
          </div>
          <div className="text-gray-600 dark:text-gray-400">Average Response Time</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {data.analytics.responseMetrics.resolutionRate}%
          </div>
          <div className="text-gray-600 dark:text-gray-400">Resolution Rate</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {data.analytics.responseMetrics.escalationRate}%
          </div>
          <div className="text-gray-600 dark:text-gray-400">Escalation Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="chart-container">
            <canvas ref={trendChartRef}></canvas>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="chart-container">
            <canvas ref={flowChartRef}></canvas>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Report Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleGenerateReport('Daily Summary')}
            className="btn btn--outline"
          >
            <i className="fas fa-chart-bar mr-2"></i>
            Daily Summary Report
          </button>
          <button 
            onClick={() => handleGenerateReport('Weekly Analytics')}
            className="btn btn--outline"
          >
            <i className="fas fa-chart-line mr-2"></i>
            Weekly Analytics
          </button>
          <button 
            onClick={() => handleGenerateReport('Monthly Overview')}
            className="btn btn--outline"
          >
            <i className="fas fa-chart-pie mr-2"></i>
            Monthly Overview
          </button>
        </div>
      </div>
    </div>
  );
};

// Geo-fence Management component
const GeoFenceManagement = ({ data, showToast }) => {
  const [selectedFence, setSelectedFence] = useState(null);
  const [showNewFenceModal, setShowNewFenceModal] = useState(false);

  const handleDeleteFence = (fenceId) => {
    showToast('Geo-fence deleted successfully', 'success');
  };

  const handleEditFence = (fence) => {
    setSelectedFence(fence);
    setShowNewFenceModal(true);
  };

  const handleSaveFence = (e) => {
    e.preventDefault();
    showToast(selectedFence ? 'Geo-fence updated successfully' : 'Geo-fence created successfully', 'success');
    setShowNewFenceModal(false);
    setSelectedFence(null);
  };

  const getFenceTypeColor = (type) => {
    switch (type) {
      case 'safe': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'restricted': return 'text-red-600 bg-red-100 dark:bg-red-900';
      case 'emergency': return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Geo-fence Management</h2>
        <button
          onClick={() => setShowNewFenceModal(true)}
          className="btn btn--primary"
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Zone
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Existing Geo-fences</h3>
          <div className="space-y-4">
            {data.geoFences.map(fence => (
              <div key={fence.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{fence.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{fence.description}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getFenceTypeColor(fence.type)}`}>
                        {fence.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditFence(fence)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteFence(fence.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Zone Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800 dark:text-green-200">Safe Zones</span>
              </div>
              <span className="font-bold text-green-700 dark:text-green-300">
                {data.geoFences.filter(f => f.type === 'safe').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-800 dark:text-red-200">Restricted Zones</span>
              </div>
              <span className="font-bold text-red-700 dark:text-red-300">
                {data.geoFences.filter(f => f.type === 'restricted').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900 rounded">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium text-orange-800 dark:text-orange-200">Emergency Zones</span>
              </div>
              <span className="font-bold text-orange-700 dark:text-orange-300">
                {data.geoFences.filter(f => f.type === 'emergency').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showNewFenceModal}
        onClose={() => {
          setShowNewFenceModal(false);
          setSelectedFence(null);
        }}
        title={selectedFence ? 'Edit Geo-fence' : 'Add New Geo-fence'}
      >
        <form onSubmit={handleSaveFence} className="space-y-4">
          <div>
            <label className="form-label">Zone Name</label>
            <input
              type="text"
              defaultValue={selectedFence?.name || ''}
              className="form-control"
              placeholder="Enter zone name"
              required
            />
          </div>

          <div>
            <label className="form-label">Zone Type</label>
            <select
              defaultValue={selectedFence?.type || 'safe'}
              className="form-control"
            >
              <option value="safe">Safe Zone</option>
              <option value="restricted">Restricted Zone</option>
              <option value="emergency">Emergency Zone</option>
            </select>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              defaultValue={selectedFence?.description || ''}
              className="form-control"
              rows="3"
              placeholder="Enter zone description"
            ></textarea>
          </div>

          <div className="flex items-center space-x-3">
            <button type="submit" className="btn btn--primary">
              <i className="fas fa-save mr-2"></i>
              {selectedFence ? 'Update Zone' : 'Create Zone'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewFenceModal(false);
                setSelectedFence(null);
              }}
              className="btn btn--secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// IoT Device Monitoring component
const IoTDeviceMonitoring = ({ data, showToast }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);

  const getDeviceStatusColor = (status) => {
    switch (status) {
      case 'online': return 'device-status-online';
      case 'alert': return 'device-status-alert';
      case 'offline': return 'device-status-offline';
      default: return 'device-status-offline';
    }
  };

  const getBatteryClass = (battery) => {
    if (battery > 50) return 'battery-good';
    if (battery > 20) return 'battery-medium';
    return 'battery-low';
  };

  const getSignalClass = (signal) => {
    if (signal > 80) return 'signal-excellent';
    if (signal > 60) return 'signal-good';
    if (signal > 40) return 'signal-fair';
    return 'signal-poor';
  };

  const handleViewDetails = (device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">IoT Device Monitoring</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.iotDevices.map(device => (
          <div key={device.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{device.type}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{device.touristName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <i className={`fas fa-circle ${getDeviceStatusColor(device.status)}`}></i>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">{device.status}</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Battery</span>
                  <span className="text-gray-900 dark:text-white">{device.battery}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div 
                    className={`progress-fill ${getBatteryClass(device.battery)}`}
                    style={{ width: `${device.battery}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Signal</span>
                  <span className="text-gray-900 dark:text-white">{device.signal}%</span>
                </div>
                <div className="progress-bar h-2">
                  <div 
                    className={`progress-fill ${getSignalClass(device.signal)}`}
                    style={{ width: `${device.signal}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <i className="fas fa-heartbeat text-red-500 mb-1"></i>
                <p className="text-xs text-gray-600 dark:text-gray-400">Heart Rate</p>
                <p className="font-semibold text-gray-900 dark:text-white">{device.vitals.heartRate} bpm</p>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <i className="fas fa-thermometer-half text-blue-500 mb-1"></i>
                <p className="text-xs text-gray-600 dark:text-gray-400">Temperature</p>
                <p className="font-semibold text-gray-900 dark:text-white">{device.vitals.temperature}°C</p>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-3">
              Last sync: {new Date(device.lastSync).toLocaleString()}
            </div>

            <button
              onClick={() => handleViewDetails(device)}
              className="btn btn--outline btn--sm w-full"
            >
              <i className="fas fa-eye mr-2"></i>
              View Details
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedDevice}
        onClose={() => setSelectedDevice(null)}
        title="Device Details"
      >
        {selectedDevice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Device ID</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedDevice.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Device Type</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedDevice.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tourist</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedDevice.touristName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <p className={`font-medium ${getDeviceStatusColor(selectedDevice.status)} capitalize`}>
                  {selectedDevice.status}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vital Signs</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-center">
                  <i className="fas fa-heartbeat text-red-500 text-xl mb-2"></i>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedDevice.vitals.heartRate} bpm</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-center">
                  <i className="fas fa-thermometer-half text-blue-500 text-xl mb-2"></i>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedDevice.vitals.temperature}°C</p>
                </div>
              </div>
            </div>

            {selectedDevice.vitals.steps && (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-center">
                <i className="fas fa-walking text-green-500 text-xl mb-2"></i>
                <p className="text-sm text-gray-600 dark:text-gray-400">Steps Today</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedDevice.vitals.steps.toLocaleString()}</p>
              </div>
            )}

            {selectedDevice.vitals.bloodGlucose && (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-center">
                <i className="fas fa-tint text-purple-500 text-xl mb-2"></i>
                <p className="text-sm text-gray-600 dark:text-gray-400">Blood Glucose</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedDevice.vitals.bloodGlucose} mg/dL</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// Settings component - Fixed to use in-memory state instead of localStorage
const Settings = ({ darkMode, toggleDarkMode, showToast }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });

  const [settings, setSettings] = useState({
    refreshInterval: '10',
    mapView: 'roadmap'
  });

  const handleSaveSettings = () => {
    showToast('Settings saved successfully', 'success');
  };

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      sms: false,
      push: true
    });
    setSettings({
      refreshInterval: '10',
      mapView: 'roadmap'
    });
    showToast('Settings reset to defaults', 'info');
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notifications</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize text-gray-900 dark:text-white">{key} Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive alerts via {key}
                </p>
              </div>
              <button
                onClick={() => handleToggleNotification(key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">System Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="form-label">Data Refresh Interval (seconds)</label>
            <select 
              className="form-control"
              value={settings.refreshInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: e.target.value }))}
            >
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Default Map View</label>
            <select 
              className="form-control"
              value={settings.mapView}
              onChange={(e) => setSettings(prev => ({ ...prev, mapView: e.target.value }))}
            >
              <option value="roadmap">Roadmap</option>
              <option value="satellite">Satellite</option>
              <option value="hybrid">Hybrid</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button onClick={handleSaveSettings} className="btn btn--primary">
          <i className="fas fa-save mr-2"></i>
          Save Settings
        </button>
        <button onClick={handleResetSettings} className="btn btn--outline">
          <i className="fas fa-undo mr-2"></i>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

// Main App component - Fixed to use in-memory state and React 18 createRoot
const App = () => {
  // Use in-memory state instead of localStorage
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview data={DATA} />;
      case 'map':
        return <LiveMap data={DATA} showToast={showToast} />;
      case 'alerts':
        return <SOSAlerts data={DATA} showToast={showToast} />;
      case 'tourists':
        return <TouristProfiles data={DATA} showToast={showToast} />;
      case 'incidents':
        return <IncidentManagement data={DATA} showToast={showToast} />;
      case 'analytics':
        return <Analytics data={DATA} />;
      case 'geofence':
        return <GeoFenceManagement data={DATA} showToast={showToast} />;
      case 'iot':
        return <IoTDeviceMonitoring data={DATA} showToast={showToast} />;
      case 'settings':
        return <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} showToast={showToast} />;
      default:
        return <DashboardOverview data={DATA} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          activeAlerts={DATA.alerts.filter(a => a.status === 'active').length}
          notifications={DATA.notifications}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Use React 18 createRoot instead of ReactDOM.render
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);