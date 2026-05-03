import React, { useState, useEffect, useRef } from 'react';
import { Bell, Wifi, RefreshCw, Search, X, MapPin, BellOff, Megaphone, LogOut, ChevronDown, UserCircle, Download } from 'lucide-react';
import { ACTIVE_ALERTS, STATIONS, getAQICategory } from '../data/mockData';
import useIsMobile from '../hooks/useIsMobile';
import * as XLSX from 'xlsx';

const sevColor = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#3b82f6' };
const sevEmoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' };

const roleColor = { Administrator: '#9333ea', 'Field Officer': '#3b82f6', 'Policy Analyst': '#f97316', 'Data Scientist': '#06b6d4', 'Public User': '#22c55e', User: '#94a3b8' };

const Header = ({ currentAQI, onRefresh, onSendAlert, user, onLogout, loginNotifs = [] }) => {
  const [time, setTime] = useState(new Date());
  const [showAlerts, setShowAlerts] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const userRef = useRef(null);
  const [showUser, setShowUser] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);
  const alertRef = useRef(null);
  const isMobile = useIsMobile();
  const category = getAQICategory(currentAQI);
  const allNotifs = [...loginNotifs, ...ACTIVE_ALERTS];
  const unreadCount = allNotifs.filter(a => !readIds.has(a.id) && (a.severity === 'critical' || a.severity === 'high' || loginNotifs.some(l => l.id === a.id))).length;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
      if (alertRef.current && !alertRef.current.contains(e.target)) setShowAlerts(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const results = query.trim().length < 1 ? [] : STATIONS.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.zone.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const markAllRead = () => setReadIds(new Set(ACTIVE_ALERTS.map(a => a.id)));

  const exportLoginData = () => {
    const loginLog = JSON.parse(localStorage.getItem('airsense_login_log') || '[]');
    const registeredUsers = JSON.parse(localStorage.getItem('airsense_users') || '[]');

    const logSheet = loginLog.map((e, i) => ({
      'Sr.No': i + 1,
      'Full Name': e.name,
      'Email': e.email,
      'Role': e.role,
      'Login Date': e.loginDate,
      'Login Time': e.loginTime,
      'AQI at Login': e.aqiAtLogin,
      'Timestamp (ISO)': e.loginISO,
    }));

    const usersSheet = registeredUsers.map((u, i) => ({
      'Sr.No': i + 1,
      'Full Name': u.name,
      'Email': u.email,
      'Role': u.role,
      'Account Type': 'Registered',
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(logSheet.length ? logSheet : [{ Note: 'No login events recorded yet' }]), 'Login History');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(usersSheet.length ? usersSheet : [{ Note: 'No registered users yet' }]), 'Registered Users');
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `AirSense_Users_${date}.xlsx`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); if (onRefresh) onRefresh(); }, 1500);
  };

  if (isMobile) {
    return (
      <header style={{
        background: 'linear-gradient(180deg,#0a0f1e 0%,#0f1729 100%)',
        borderBottom: '1px solid #1e293b',
        padding: '0 14px',
        height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100, gap: 8,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌫</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.1 }}>AirSense AI</div>
            <div style={{ fontSize: 8, color: '#64748b' }}>DELHI-NCR</div>
          </div>
        </div>

        {/* AQI badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 8, background: category.bg + '88', border: `1px solid ${category.color}33`, flex: 1, maxWidth: 140, justifyContent: 'center' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: category.color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: '#94a3b8' }}>AQI</span>
          <span style={{ fontSize: 17, fontWeight: 800, color: category.color, fontFamily: 'JetBrains Mono' }}>{currentAQI}</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: category.color }}>{category.label}</span>
        </div>

        {/* Right: search + send + bell + user */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button onClick={() => setShowMobileSearch(v => !v)} style={{ width: 32, height: 32, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={14} color="#94a3b8" />
          </button>
          <button onClick={onSendAlert} style={{ width: 32, height: 32, borderRadius: 8, background: '#ef444422', border: '1px solid #ef444444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Megaphone size={14} color="#ef4444" />
          </button>
          {/* Bell */}
          <div ref={alertRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowAlerts(v => !v)} style={{ width: 32, height: 32, borderRadius: 8, background: unreadCount > 0 ? '#ef444422' : '#1e293b', border: `1px solid ${unreadCount > 0 ? '#ef444444' : '#334155'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Bell size={14} color={unreadCount > 0 ? '#ef4444' : '#94a3b8'} />
              {unreadCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 15, height: 15, borderRadius: '50%', background: '#ef4444', fontSize: 8, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a0f1e' }}>{unreadCount}</span>}
            </button>
            {showAlerts && (
              <div style={{ position: 'fixed', top: 60, left: 10, right: 10, background: '#0f1729', border: '1px solid #1e293b', borderRadius: 12, boxShadow: '0 20px 56px rgba(0,0,0,0.8)', zIndex: 300, overflow: 'hidden', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Notifications {unreadCount > 0 && <span style={{ marginLeft: 6, fontSize: 10, color: '#ef4444', background: '#ef444422', padding: '1px 6px', borderRadius: 10 }}>{unreadCount} unread</span>}</span>
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}><BellOff size={11} />All read</button>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {allNotifs.map(alert => {
                    const isRead = readIds.has(alert.id);
                    return (
                      <div key={alert.id} onClick={() => setReadIds(prev => new Set([...prev, alert.id]))}
                        style={{ padding: '10px 14px', borderBottom: '1px solid #1e293b22', display: 'flex', gap: 8, cursor: 'pointer', background: isRead ? 'transparent' : sevColor[alert.severity] + '08' }}>
                        <span style={{ fontSize: 13, flexShrink: 0 }}>{sevEmoji[alert.severity]}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: isRead ? '#64748b' : '#f1f5f9', lineHeight: 1.4 }}>{alert.message}</div>
                          <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{alert.type} • {alert.time}</div>
                        </div>
                        {!isRead && <div style={{ width: 6, height: 6, borderRadius: '50%', background: sevColor[alert.severity], flexShrink: 0, marginTop: 3 }} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* User */}
          {user && (
            <div ref={userRef} style={{ position: 'relative' }}>
              <button onClick={() => setShowUser(v => !v)} style={{ width: 32, height: 32, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCircle size={16} color={roleColor[user.role] || '#94a3b8'} />
              </button>
              {showUser && (
                <div style={{ position: 'absolute', top: 40, right: 0, width: 200, background: '#0f1729', border: '1px solid #1e293b', borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.7)', zIndex: 300, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #1e293b' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{user.email}</div>
                    <span style={{ marginTop: 4, display: 'inline-block', fontSize: 9, fontWeight: 700, color: roleColor[user.role] || '#94a3b8', padding: '1px 6px', borderRadius: 10, background: (roleColor[user.role] || '#94a3b8') + '22' }}>{user.role}</span>
                  </div>
                  <div style={{ padding: 6 }}>
                    {user.role === 'Administrator' && (
                      <button onClick={() => { exportLoginData(); setShowUser(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: 12 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#22c55e11'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                        <Download size={12} /> Export Login Data (.xlsx)
                      </button>
                    )}
                    <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12 }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ef444411'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <LogOut size={12} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div ref={searchRef} style={{ position: 'fixed', top: 60, left: 10, right: 10, background: '#0f1729', border: '1px solid #3b82f644', borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.8)', zIndex: 300, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid #1e293b' }}>
              <Search size={14} color="#3b82f6" />
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search station or zone…"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 13, fontFamily: 'Inter' }} />
              {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}><X size={13} /></button>}
              <button onClick={() => { setShowMobileSearch(false); setQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: 12 }}>Done</button>
            </div>
            {query.length === 0 ? (
              <div style={{ padding: '10px 14px' }}>
                <div style={{ fontSize: 10, color: '#475569', marginBottom: 8, letterSpacing: '0.06em' }}>QUICK FILTERS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Delhi', 'Gurugram', 'NOIDA', 'Faridabad', 'Ghaziabad', 'Severe'].map(tag => (
                    <button key={tag} onClick={() => setQuery(tag)} style={{ padding: '4px 10px', borderRadius: 20, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>{tag}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {results.length === 0 ? (
                  <div style={{ padding: 16, fontSize: 12, color: '#475569', textAlign: 'center' }}>No stations found for "{query}"</div>
                ) : results.map(s => {
                  const cat = getAQICategory(s.aqi);
                  return (
                    <div key={s.id} onClick={() => { setQuery(s.name); setShowMobileSearch(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderTop: '1px solid #1e293b22', cursor: 'pointer' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{s.zone}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: cat.color, fontFamily: 'JetBrains Mono' }}>{s.aqi}</div>
                        <div style={{ fontSize: 9, color: cat.color }}>{cat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </header>
    );
  }

  return (
    <header style={{
      background: 'linear-gradient(180deg,#0a0f1e 0%,#0f1729 100%)',
      borderBottom: '1px solid #1e293b',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '12px',
    }}>

      {/* LEFT: Logo + AQI */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌫</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>AirSense AI</div>
            <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '0.05em' }}>DELHI-NCR POLLUTION DASHBOARD</div>
          </div>
        </div>
        <div style={{ width: 1, height: 32, background: '#1e293b' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 8, background: category.bg + '88', border: `1px solid ${category.color}33` }}>
          <span className="status-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: category.color, display: 'inline-block', animation: 'pulse-glow 2s ease-in-out infinite', boxShadow: `0 0 8px ${category.color}` }} />
          <span style={{ fontSize: 11, color: '#94a3b8' }}>NCR AQI</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: category.color, fontFamily: 'JetBrains Mono' }}>{currentAQI}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: category.color, padding: '1px 5px', borderRadius: 4, background: category.color + '22' }}>{category.label}</span>
        </div>
      </div>

      {/* CENTER: Search Bar */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#111827', border: `1px solid ${showSearch ? '#3b82f6' : '#1e293b'}`,
          borderRadius: 10, padding: '0 12px', height: 38, transition: 'border 0.15s',
        }}>
          <Search size={14} color="#475569" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            placeholder="Search station, zone, city… (36 CPCB stations)"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter',
            }}
          />
          {query && <button onClick={() => { setQuery(''); setShowSearch(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}><X size={13} /></button>}
          <span style={{ fontSize: 9, color: '#334155', background: '#1e293b', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>36 stations</span>
        </div>

        {/* Search Dropdown */}
        {showSearch && (query.length > 0) && (
          <div style={{
            position: 'absolute', top: 44, left: 0, right: 0,
            background: '#0f1729', border: '1px solid #1e293b',
            borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            zIndex: 300, overflow: 'hidden',
          }}>
            {results.length === 0 ? (
              <div style={{ padding: '14px 16px', fontSize: 12, color: '#475569', textAlign: 'center' }}>
                No stations found for "{query}"
              </div>
            ) : (
              <>
                <div style={{ padding: '8px 14px 4px', fontSize: 10, color: '#475569', letterSpacing: '0.06em' }}>
                  {results.length} RESULT{results.length > 1 ? 'S' : ''} — CPCB MONITORING STATIONS
                </div>
                {results.map(s => {
                  const cat = getAQICategory(s.aqi);
                  return (
                    <div key={s.id} onClick={() => { setQuery(s.name); setShowSearch(false); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer', borderTop: '1px solid #1e293b22', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9' }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={9} color="#334155" />
                          {s.zone}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: cat.color, fontFamily: 'JetBrains Mono' }}>{s.aqi}</div>
                        <div style={{ fontSize: 9, color: cat.color }}>{cat.label}</div>
                      </div>
                      <div style={{ width: 48 }}>
                        <div style={{ fontSize: 9, color: '#475569', marginBottom: 2 }}>PM2.5: {s.pm25}</div>
                        <div style={{ height: 3, borderRadius: 2, background: '#1e293b', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, (s.aqi / 500) * 100)}%`, height: '100%', background: cat.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div style={{ padding: '6px 14px 8px', fontSize: 10, color: '#334155', borderTop: '1px solid #1e293b' }}>
                  Source: CPCB (Central Pollution Control Board) — Delhi-NCR Real-time Network
                </div>
              </>
            )}
          </div>
        )}

        {/* Quick filters shown when focused with no query */}
        {showSearch && query.length === 0 && (
          <div style={{ position: 'absolute', top: 44, left: 0, right: 0, background: '#0f1729', border: '1px solid #1e293b', borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.6)', zIndex: 300, padding: '10px 14px' }}>
            <div style={{ fontSize: 10, color: '#475569', marginBottom: 8, letterSpacing: '0.06em' }}>QUICK FILTERS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Delhi', 'Gurugram', 'NOIDA', 'Faridabad', 'Ghaziabad', 'Severe', 'Very Poor', 'Poor'].map(tag => (
                <button key={tag} onClick={() => { setQuery(tag); }}
                  style={{ padding: '4px 10px', borderRadius: 20, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Time + Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', fontFamily: 'JetBrains Mono' }}>
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: 10, color: '#475569' }}>
            {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Wifi size={12} color="#22c55e" />
          <span style={{ fontSize: 10, color: '#475569' }}>CPCB Live</span>
        </div>

        {/* Send Alert Button */}
        <button onClick={onSendAlert} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px',
          height: 34, borderRadius: 8, cursor: 'pointer', fontFamily: 'Inter',
          background: 'linear-gradient(135deg,#ef444422,#f9731622)',
          border: '1px solid #ef444444', color: '#ef4444', fontSize: 12, fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          <Megaphone size={13} />
          Send Alert
        </button>

        <button onClick={handleRefresh} style={{ width: 34, height: 34, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={14} color="#94a3b8" style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
        </button>

        {/* User Avatar */}
        {user && (
          <div ref={userRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowUser(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '0 10px',
              height: 34, borderRadius: 8, background: '#1e293b', border: '1px solid #334155',
              cursor: 'pointer', transition: 'background 0.15s',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: roleColor[user.role] + '33',
                border: `2px solid ${roleColor[user.role] || '#94a3b8'}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <UserCircle size={14} color={roleColor[user.role] || '#94a3b8'} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.1 }}>{user.name}</div>
                <div style={{ fontSize: 9, color: roleColor[user.role] || '#64748b' }}>{user.role}</div>
              </div>
              <ChevronDown size={11} color="#475569" />
            </button>

            {showUser && (
              <div style={{ position: 'absolute', top: 42, right: 0, width: 220, background: '#0f1729', border: '1px solid #1e293b', borderRadius: 12, boxShadow: '0 16px 40px rgba(0,0,0,0.7)', zIndex: 300, overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', background: roleColor[user.role] + '11' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{user.email}</div>
                  <span style={{ marginTop: 6, display: 'inline-block', fontSize: 9, fontWeight: 700, color: roleColor[user.role] || '#94a3b8', padding: '2px 7px', borderRadius: 10, background: (roleColor[user.role] || '#94a3b8') + '22' }}>{user.role}</span>
                </div>
                <div style={{ padding: '6px' }}>
                  {user.role === 'Administrator' && (
                    <button onClick={() => { exportLoginData(); setShowUser(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: 12, transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#22c55e11'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      <Download size={13} /> Export Login Data (.xlsx)
                    </button>
                  )}
                  <button onClick={onLogout} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                    borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12,
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#ef444411'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notification Bell */}
        <div ref={alertRef} style={{ position: 'relative' }}>
          <button onClick={() => setShowAlerts(v => !v)} style={{
            width: 34, height: 34, borderRadius: 8,
            background: unreadCount > 0 ? '#ef444422' : '#1e293b',
            border: `1px solid ${unreadCount > 0 ? '#ef444444' : '#334155'}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          }}>
            <Bell size={14} color={unreadCount > 0 ? '#ef4444' : '#94a3b8'} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: '50%', background: '#ef4444', fontSize: 9, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a0f1e' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showAlerts && (
            <div style={{ position: 'absolute', top: 42, right: 0, width: 380, background: '#0f1729', border: '1px solid #1e293b', borderRadius: 12, boxShadow: '0 20px 56px rgba(0,0,0,0.7)', zIndex: 300, overflow: 'hidden' }}>

              {/* Notification Header */}
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: '#ef4444', padding: '1px 6px', borderRadius: 10, background: '#ef444422' }}>
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: 11 }}>
                  <BellOff size={11} /> Mark all read
                </button>
              </div>

              {/* Severity summary strip */}
              <div style={{ display: 'flex', borderBottom: '1px solid #1e293b' }}>
                {[
                  { label: 'Critical', key: 'critical', count: allNotifs.filter(a => a.severity === 'critical').length },
                  { label: 'High', key: 'high', count: allNotifs.filter(a => a.severity === 'high').length },
                  { label: 'Medium', key: 'medium', count: allNotifs.filter(a => a.severity === 'medium').length },
                  { label: 'Low', key: 'low', count: allNotifs.filter(a => a.severity === 'low').length },
                ].map(item => (
                  <div key={item.key} style={{ flex: 1, textAlign: 'center', padding: '7px 4px', borderRight: '1px solid #1e293b22' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: sevColor[item.key], fontFamily: 'JetBrains Mono' }}>{item.count}</div>
                    <div style={{ fontSize: 9, color: '#475569' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Alert list */}
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {allNotifs.map(alert => {
                  const isRead = readIds.has(alert.id);
                  return (
                    <div key={alert.id}
                      onClick={() => setReadIds(prev => new Set([...prev, alert.id]))}
                      style={{
                        padding: '10px 14px', borderBottom: '1px solid #1e293b22',
                        display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer',
                        background: isRead ? 'transparent' : sevColor[alert.severity] + '08',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                      onMouseLeave={e => e.currentTarget.style.background = isRead ? 'transparent' : sevColor[alert.severity] + '08'}
                    >
                      <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>{sevEmoji[alert.severity]}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: sevColor[alert.severity], padding: '1px 5px', borderRadius: 3, background: sevColor[alert.severity] + '22', letterSpacing: '0.06em' }}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span style={{ fontSize: 9, color: '#334155' }}>{alert.time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: isRead ? '#64748b' : '#f1f5f9', lineHeight: 1.45 }}>{alert.message}</div>
                        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{alert.type}</div>
                      </div>
                      {!isRead && <div style={{ width: 6, height: 6, borderRadius: '50%', background: sevColor[alert.severity], flexShrink: 0, marginTop: 4 }} />}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div style={{ padding: '8px 14px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#334155' }}>CPCB / SAFAR / IMD Integrated Alerts</span>
                <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 600 }}>● Live</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </header>
  );
};

export default Header;
