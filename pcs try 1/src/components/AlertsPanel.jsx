import React, { useState } from 'react';
import { ACTIVE_ALERTS } from '../data/mockData';
import { AlertTriangle, AlertCircle, Info, Filter, Send, Users, Megaphone } from 'lucide-react';

const severityConfig = {
  critical: {
    color: '#ef4444',
    bg: '#ef444411',
    border: '#ef444433',
    label: 'CRITICAL',
    icon: <AlertCircle size={16} color="#ef4444" />,
    emoji: '🔴',
  },
  high: {
    color: '#f97316',
    bg: '#f9731611',
    border: '#f9731633',
    label: 'HIGH',
    icon: <AlertTriangle size={16} color="#f97316" />,
    emoji: '🟠',
  },
  medium: {
    color: '#eab308',
    bg: '#eab30811',
    border: '#eab30833',
    label: 'MEDIUM',
    icon: <AlertTriangle size={16} color="#eab308" />,
    emoji: '🟡',
  },
  low: {
    color: '#3b82f6',
    bg: '#3b82f611',
    border: '#3b82f633',
    label: 'LOW',
    icon: <Info size={16} color="#3b82f6" />,
    emoji: '🔵',
  },
};

const ALL_ALERTS = [
  ...ACTIVE_ALERTS,
  { id: "A007", severity: "low", message: "DTU station PM10 readings above 200 μg/m³ — verify sensor calibration", time: "4 hrs ago", type: "Data Quality" },
  { id: "A008", severity: "medium", message: "Crop burning season peak expected — activate Haryana field teams", time: "5 hrs ago", type: "Seasonal Alert" },
  { id: "A009", severity: "low", message: "CPCB data feed delay detected at Gurugram Sector 51 station", time: "6 hrs ago", type: "System" },
  { id: "A010", severity: "high", message: "AQI Forecast: Severe conditions likely tomorrow morning (6–9 AM)", time: "7 hrs ago", type: "Forecast Alert" },
  { id: "A011", severity: "medium", message: "NGT monitoring inspection scheduled for Wazirpur industrial zone", time: "8 hrs ago", type: "Compliance" },
  { id: "A012", severity: "low", message: "Pollution data report for October submitted to Ministry of Environment", time: "1 day ago", type: "Report" },
];

const AlertCard = ({ alert }) => {
  const config = severityConfig[alert.severity];
  return (
    <div style={{
      background: config.bg,
      border: `1px solid ${config.border}`,
      borderRadius: '10px',
      padding: '12px 14px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
    }}>
      <div style={{ flexShrink: 0, marginTop: '1px' }}>{config.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            color: config.color,
            padding: '1px 5px',
            borderRadius: '3px',
            background: config.color + '22',
            letterSpacing: '0.08em',
          }}>
            {config.label}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#475569' }}>{alert.type}</span>
            <span style={{ fontSize: '10px', color: '#334155' }}>{alert.time}</span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#f1f5f9', lineHeight: 1.5 }}>
          {alert.message}
        </div>
      </div>
    </div>
  );
};

const SentAlertCard = ({ alert }) => {
  const config = severityConfig[alert.severity];
  return (
    <div style={{
      background: config.bg, border: `1px solid ${config.border}`,
      borderRadius: '10px', padding: '12px 14px',
      display: 'flex', gap: '12px', alignItems: 'flex-start',
    }}>
      <div style={{ flexShrink: 0 }}><Send size={15} color={config.color} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', flexWrap: 'wrap', gap: 4 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: config.color, padding: '1px 5px', borderRadius: '3px', background: config.color + '22', letterSpacing: '0.08em' }}>{config.label}</span>
            <span style={{ fontSize: '9px', color: '#22c55e', fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: '#22c55e22' }}>BROADCAST SENT</span>
          </div>
          <span style={{ fontSize: '10px', color: '#334155' }}>{alert.time}</span>
        </div>
        <div style={{ fontSize: '12px', color: '#f1f5f9', lineHeight: 1.5, marginBottom: 6 }}>{alert.message}</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={10} color="#475569" />
            <span style={{ fontSize: '10px', color: '#64748b' }}>~{alert.recipients} recipients</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {alert.channels?.map(ch => (
              <span key={ch} style={{ fontSize: '9px', color: '#3b82f6', padding: '1px 5px', borderRadius: 3, background: '#3b82f622', fontWeight: 600 }}>
                {ch.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertsPanel = ({ sentAlerts = [] }) => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? ALL_ALERTS : ALL_ALERTS.filter(a => a.severity === filter);

  const counts = {
    all: ALL_ALERTS.length,
    critical: ALL_ALERTS.filter(a => a.severity === 'critical').length,
    high: ALL_ALERTS.filter(a => a.severity === 'high').length,
    medium: ALL_ALERTS.filter(a => a.severity === 'medium').length,
    low: ALL_ALERTS.filter(a => a.severity === 'low').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {[
          { key: 'all', label: 'Total Alerts', color: '#94a3b8' },
          { key: 'critical', label: 'Critical', color: '#ef4444' },
          { key: 'high', label: 'High', color: '#f97316' },
          { key: 'medium', label: 'Medium', color: '#eab308' },
          { key: 'low', label: 'Low', color: '#3b82f6' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            style={{
              background: filter === item.key ? item.color + '22' : '#111827',
              border: `1px solid ${filter === item.key ? item.color + '55' : '#1e293b'}`,
              borderRadius: '12px',
              padding: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 800, color: item.color, fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
              {counts[item.key]}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{item.label}</div>
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
              Active Alerts
              <span style={{
                marginLeft: '8px',
                fontSize: '11px',
                color: '#ef4444',
                padding: '2px 7px',
                borderRadius: '10px',
                background: '#ef444422',
              }}>
                {counts.critical + counts.high} require action
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
              Showing {filtered.length} of {counts.all} alerts
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #334155' }}>
            <Filter size={12} color="#64748b" />
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} Priority
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Alert Timeline */}
      <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9', marginBottom: '14px' }}>Alert History — Last 24 Hours</div>
        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          <div style={{
            position: 'absolute',
            left: '6px',
            top: 0,
            bottom: 0,
            width: '2px',
            background: '#1e293b',
          }} />
          {ALL_ALERTS.map((alert, i) => {
            const config = severityConfig[alert.severity];
            return (
              <div key={alert.id} style={{ display: 'flex', gap: '12px', marginBottom: '10px', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '-17px',
                  top: '3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: config.color,
                  border: '2px solid #0f1729',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 500 }}>{alert.message.substring(0, 70)}{alert.message.length > 70 ? '...' : ''}</span>
                    <span style={{ fontSize: '10px', color: '#475569', flexShrink: 0, marginLeft: '8px' }}>{alert.time}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '9px', color: config.color, fontWeight: 600 }}>{config.label}</span>
                    <span style={{ fontSize: '9px', color: '#334155' }}>•</span>
                    <span style={{ fontSize: '9px', color: '#475569' }}>{alert.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Sent Broadcasts Section */}
      {sentAlerts.length > 0 && (
        <div style={{ background: '#111827', border: '1px solid #22c55e33', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '14px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#22c55e22', border: '1px solid #22c55e44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={14} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>Sent Broadcasts</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>{sentAlerts.length} alert{sentAlerts.length > 1 ? 's' : ''} dispatched this session</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sentAlerts.map(alert => <SentAlertCard key={alert.id} alert={alert} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
