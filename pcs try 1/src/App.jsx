import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import SourceAnalysis from './components/SourceAnalysis';
import Forecast from './components/Forecast';
import Policy from './components/Policy';
import AlertsPanel from './components/AlertsPanel';
import StationsMap from './components/StationsMap';
import HistoricalData from './components/HistoricalData';
import SendAlertModal from './components/SendAlertModal';
import LoginPage from './components/LoginPage';
import { getAQICategory } from './data/mockData';
import useIsMobile from './hooks/useIsMobile';

const TABS = {
  overview: Overview,
  sources: SourceAnalysis,
  forecast: Forecast,
  policy: Policy,
  alerts: AlertsPanel,
  stations: StationsMap,
  historical: HistoricalData,
};

const TAB_TITLES = {
  overview: { title: 'Dashboard Overview', sub: 'Real-time air quality monitoring across Delhi-NCR' },
  sources: { title: 'AI Source Attribution Analysis', sub: 'Machine learning-based pollution source identification' },
  forecast: { title: 'AI-Powered AQI Forecast', sub: 'LSTM neural network predictions up to 72 hours' },
  policy: { title: 'Policy & GRAP Management', sub: 'Graded Response Action Plan and AI policy recommendations' },
  alerts: { title: 'Alerts & Notifications', sub: 'Real-time monitoring alerts and health advisories' },
  stations: { title: 'Monitoring Station Map', sub: 'Interactive map of Delhi-NCR CPCB monitoring stations' },
  historical: { title: 'Historical Data Analysis', sub: '30-day trend analysis and comparative statistics' },
};

const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('airsense_session')); } catch { return null; }
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [currentAQI, setCurrentAQI] = useState(334);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [sentAlerts, setSentAlerts] = useState([]);
  const [loginNotifs, setLoginNotifs] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.round((Math.random() - 0.5) * 10);
      setCurrentAQI(prev => Math.max(250, Math.min(450, prev + variation)));
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (userData) => {
    sessionStorage.setItem('airsense_session', JSON.stringify(userData));
    setUser(userData);
    const now = new Date();
    const logEntry = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      loginDate: now.toLocaleDateString('en-IN'),
      loginTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      loginISO: now.toISOString(),
      aqiAtLogin: currentAQI,
    };
    const existing = JSON.parse(localStorage.getItem('airsense_login_log') || '[]');
    localStorage.setItem('airsense_login_log', JSON.stringify([logEntry, ...existing]));
    const notif = {
      id: 'LOGIN-' + Date.now(),
      severity: 'low',
      message: `Welcome back, ${userData.name}! You are now monitoring Delhi-NCR air quality in real-time. Current AQI: ${currentAQI} — GRAP Stage II Active.`,
      type: 'Login Notification',
      time: 'Just now',
      role: userData.role,
    };
    setLoginNotifs(prev => [notif, ...prev]);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('airsense_session');
    setUser(null);
    setLoginNotifs([]);
    setSentAlerts([]);
  };

  const handleAlertSent = (alert) => {
    setSentAlerts(prev => [alert, ...prev]);
    if (activeTab !== 'alerts') setActiveTab('alerts');
  };

  const ActiveComponent = TABS[activeTab];
  const tabInfo = TAB_TITLES[activeTab];
  const cat = getAQICategory(currentAQI);

  if (!user) return <LoginPage onLogin={handleLogin} />;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f1e',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Header currentAQI={currentAQI} onSendAlert={() => setShowAlertModal(true)} user={user} onLogout={handleLogout} loginNotifs={loginNotifs} />

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar — desktop: vertical panel | mobile: fixed bottom tab bar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <main style={{
          flex: 1,
          padding: isMobile ? '14px 14px' : '20px 24px',
          overflowY: 'auto',
          minWidth: 0,
          paddingBottom: isMobile ? '72px' : '20px',
        }}>
          {/* Page Header */}
          {isMobile ? (
            <div style={{ marginBottom: 14 }}>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>{tabInfo.title}</h1>
              <p style={{ fontSize: 11, color: '#475569', marginTop: 2, marginBottom: 0 }}>{tabInfo.sub}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.2 }}>{tabInfo.title}</h1>
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px', marginBottom: 0 }}>{tabInfo.sub}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '10px', background: cat.bg + '66', border: `1px solid ${cat.color}44` }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Delhi AQI Now</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: cat.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{currentAQI}</span>
                      <span style={{ fontSize: '11px', color: cat.color, fontWeight: 600 }}>{cat.label}</span>
                    </div>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: cat.color + '22', border: `3px solid ${cat.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                    {currentAQI > 400 ? '☠️' : currentAQI > 300 ? '😷' : currentAQI > 200 ? '😰' : '🌫️'}
                  </div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: '10px', background: '#111827', border: '1px solid #1e293b', maxWidth: '220px' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>Health Advisory</div>
                  <div style={{ fontSize: '11px', color: '#f1f5f9', lineHeight: 1.4 }}>
                    {currentAQI > 400 ? 'Stay indoors. Avoid all outdoor activities. Use air purifiers.' : currentAQI > 300 ? 'Avoid prolonged outdoor activities. Wear N95 mask outdoors.' : currentAQI > 200 ? 'Sensitive groups should limit outdoor exposure.' : 'Moderate outdoor activity acceptable for healthy individuals.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Component */}
          <div className="animate-fade-in">
            <ActiveComponent sentAlerts={sentAlerts} />
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div style={{ fontSize: '11px', color: '#334155' }}>
              Data sources: CPCB (Central Pollution Control Board) • SAFAR (System of Air Quality and Weather Forecasting) • IMD
            </div>
            <div style={{ fontSize: '11px', color: '#334155' }}>
              Last updated: {lastUpdated.toLocaleTimeString('en-IN')} •
              AirSense AI Dashboard v1.0 • Delhi-NCR Region
            </div>
          </div>
        </main>
      </div>

      {/* Send Alert Modal */}
      {showAlertModal && (
        <SendAlertModal
          onClose={() => setShowAlertModal(false)}
          onSend={handleAlertSent}
        />
      )}
    </div>
  );
};

export default App;
