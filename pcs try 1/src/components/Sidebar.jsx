import React from 'react';
import {
  LayoutDashboard, Layers, TrendingUp, FileText,
  Bell, MapPin, Activity
} from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
  { id: 'sources', label: 'Source Analysis', icon: Layers, badge: null },
  { id: 'forecast', label: 'AI Forecast', icon: TrendingUp, badge: '72h' },
  { id: 'policy', label: 'Policy & GRAP', icon: FileText, badge: null },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: '6' },
  { id: 'stations', label: 'Stations Map', icon: MapPin, badge: null },
  { id: 'historical', label: 'Historical Data', icon: Activity, badge: null },
];

const Sidebar = ({ activeTab, onTabChange }) => {
  const isMobile = useIsMobile();

  /* ── MOBILE: fixed bottom tab bar ── */
  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: '#0f1729', borderTop: '1px solid #1e293b',
        display: 'flex', alignItems: 'stretch', height: 58,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => onTabChange(item.id)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, border: 'none', cursor: 'pointer',
                background: isActive ? '#3b82f611' : 'transparent',
                borderTop: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                padding: '6px 2px 4px', position: 'relative', transition: 'background 0.15s',
              }}>
              <Icon size={18} color={isActive ? '#3b82f6' : '#475569'} />
              <span style={{ fontSize: 9, color: isActive ? '#3b82f6' : '#475569', fontWeight: isActive ? 700 : 400, lineHeight: 1, textAlign: 'center' }}>
                {item.label === 'Source Analysis' ? 'Sources' : item.label === 'Stations Map' ? 'Map' : item.label === 'Historical Data' ? 'History' : item.label === 'Policy & GRAP' ? 'Policy' : item.label}
              </span>
              {item.badge && (
                <span style={{
                  position: 'absolute', top: 4, right: '50%', transform: 'translateX(10px)',
                  fontSize: 8, fontWeight: 700, minWidth: 14, height: 14, borderRadius: 7,
                  background: item.id === 'alerts' ? '#ef4444' : '#3b82f6',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  /* ── DESKTOP: vertical sidebar ── */
  return (
    <aside style={{
      width: '220px',
      minHeight: 'calc(100vh - 64px)',
      background: '#0f1729',
      borderRight: '1px solid #1e293b',
      padding: '16px 0',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <nav style={{ flex: 1 }}>
        <div style={{ padding: '0 12px 8px', fontSize: '10px', fontWeight: 600, color: '#475569', letterSpacing: '0.1em' }}>
          NAVIGATION
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => onTabChange(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                background: isActive ? 'linear-gradient(90deg, #3b82f622 0%, transparent 100%)' : 'transparent',
                border: 'none', borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s ease', textAlign: 'left',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#1e293b44'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={16} color={isActive ? '#3b82f6' : '#64748b'} />
              <span style={{ flex: 1, fontSize: '13px', fontWeight: isActive ? 600 : 400, color: isActive ? '#f1f5f9' : '#94a3b8' }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  fontSize: '10px', fontWeight: 700,
                  color: item.id === 'alerts' ? '#ef4444' : '#3b82f6',
                  background: item.id === 'alerts' ? '#ef444422' : '#3b82f622',
                  padding: '2px 6px', borderRadius: '10px',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '12px', borderTop: '1px solid #1e293b' }}>
        <div style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', color: '#475569', marginBottom: '6px', letterSpacing: '0.05em' }}>AI MODELS</div>
          {[
            { name: 'Source Attribution', acc: '94%' },
            { name: 'LSTM Forecast', acc: '89%' },
            { name: 'Anomaly Detection', acc: '87%' },
          ].map(model => (
            <div key={model.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '5px', height: '5px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{model.name}</span>
              </div>
              <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 600 }}>{model.acc}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#22c55e11', border: '1px solid #22c55e22', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: '#22c55e' }}>DATA SOURCES</div>
            <div style={{ fontSize: '9px', color: '#475569' }}>CPCB • SAFAR • IMD</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: 700 }}>LIVE</div>
            <div style={{ fontSize: '9px', color: '#475569' }}>36 stations</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
