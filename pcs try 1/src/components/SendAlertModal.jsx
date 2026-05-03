import React, { useState } from 'react';
import { X, Send, AlertCircle, AlertTriangle, Info, Users, Megaphone } from 'lucide-react';

const ZONES = [
  'All Delhi-NCR (Broadcast)',
  'Delhi (All)',
  'East Delhi',
  'West Delhi',
  'North Delhi',
  'South Delhi',
  'Central Delhi',
  'North West Delhi',
  'South West Delhi',
  'South East Delhi',
  'Gurugram, Haryana',
  'Faridabad, Haryana',
  'NOIDA, Uttar Pradesh',
  'Greater NOIDA, UP',
  'Ghaziabad, UP',
];

const CHANNELS = [
  { id: 'sms', label: 'SMS', icon: '📱', sub: 'Text message to registered numbers' },
  { id: 'app', label: 'App Push', icon: '🔔', sub: 'AirSense mobile app notification' },
  { id: 'email', label: 'Email', icon: '📧', sub: 'Registered email subscribers' },
  { id: 'ivr', label: 'IVR Call', icon: '📞', sub: 'Automated voice call to households' },
];

const TEMPLATES = [
  { label: 'Health Emergency', severity: 'critical', message: 'HEALTH EMERGENCY: AQI has reached SEVERE levels in your area. All outdoor activities must be stopped immediately. Use N95 mask if going outside. Seal windows and doors. Use air purifiers indoors.' },
  { label: 'GRAP Stage Activation', severity: 'high', message: 'GRAP Stage II activated for Delhi-NCR. Construction activities, diesel generators, and brick kilns are banned. Odd-even vehicle scheme may be implemented. Avoid unnecessary travel.' },
  { label: 'Crop Burning Alert', severity: 'high', message: 'Satellite data shows active crop fires in nearby regions. PM2.5 levels are expected to rise significantly tonight. Vulnerable groups (children, elderly, asthma patients) should remain indoors.' },
  { label: 'Smog Advisory', severity: 'medium', message: 'Dense smog expected tonight due to temperature inversion. Visibility may drop below 500m. Avoid driving between 10PM–6AM. Keep headlights on. Carry N95 masks.' },
  { label: 'Air Quality Improving', severity: 'low', message: 'Good news! Wind speed has increased and AQI levels are improving across Delhi-NCR. Outdoor activity restrictions have been relaxed. Continue monitoring air quality advisories.' },
];

const sevConfig = {
  critical: { color: '#ef4444', bg: '#ef444422', border: '#ef444444', label: 'CRITICAL', icon: <AlertCircle size={14} color="#ef4444" /> },
  high:     { color: '#f97316', bg: '#f9731622', border: '#f9731644', label: 'HIGH',     icon: <AlertTriangle size={14} color="#f97316" /> },
  medium:   { color: '#eab308', bg: '#eab30822', border: '#eab30844', label: 'MEDIUM',   icon: <AlertTriangle size={14} color="#eab308" /> },
  low:      { color: '#3b82f6', bg: '#3b82f622', border: '#3b82f644', label: 'LOW',      icon: <Info size={14} color="#3b82f6" /> },
};

const SendAlertModal = ({ onClose, onSend }) => {
  const [severity, setSeverity] = useState('high');
  const [zone, setZone] = useState('All Delhi-NCR (Broadcast)');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [channels, setChannels] = useState(['sms', 'app']);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const cfg = sevConfig[severity];
  const recipientEst = zone === 'All Delhi-NCR (Broadcast)' ? '2.4 Cr' : zone.includes('Delhi (All)') ? '1.9 Cr' : '12–25 L';

  const toggleChannel = (id) =>
    setChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const applyTemplate = (tpl) => {
    setSeverity(tpl.severity);
    setMessage(tpl.message);
    setTitle(tpl.label);
  };

  const handleSend = () => {
    if (!message.trim() || !title.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      const newAlert = {
        id: 'SENT-' + Date.now(),
        severity,
        message: `[Broadcast to ${zone}] ${message}`,
        time: 'Just now',
        type: title,
        sent: true,
        channels,
        zone,
        recipients: recipientEst,
      };
      onSend(newAlert);
      setTimeout(onClose, 2000);
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{
        width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto',
        background: '#0f1729', border: '1px solid #1e293b',
        borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
      }}>

        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ef444422', border: '1px solid #ef444444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={18} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Send Alert to Citizens</div>
              <div style={{ fontSize: 11, color: '#475569' }}>Broadcast pollution alerts across Delhi-NCR channels</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {sent ? (
          /* Success State */
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e', marginBottom: 6 }}>Alert Sent Successfully!</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              Broadcast to <strong style={{ color: '#f1f5f9' }}>{zone}</strong> via {channels.length} channel{channels.length > 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>~{recipientEst} recipients notified</div>
          </div>
        ) : (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Quick Templates */}
            <div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>QUICK TEMPLATES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {TEMPLATES.map(tpl => (
                  <button key={tpl.label} onClick={() => applyTemplate(tpl)}
                    style={{
                      padding: '5px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer',
                      background: sevConfig[tpl.severity].bg, border: `1px solid ${sevConfig[tpl.severity].border}`,
                      color: sevConfig[tpl.severity].color, fontWeight: 500,
                    }}>
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Title */}
            <div>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>ALERT TITLE *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Severe Smog Warning — North Delhi"
                maxLength={80}
                style={{
                  width: '100%', background: '#111827', border: '1px solid #1e293b', borderRadius: 8,
                  padding: '9px 12px', color: '#f1f5f9', fontSize: 13, outline: 'none', fontFamily: 'Inter',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Severity + Zone Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>SEVERITY LEVEL *</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {Object.entries(sevConfig).map(([key, c]) => (
                    <button key={key} onClick={() => setSeverity(key)}
                      style={{
                        flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 700,
                        background: severity === key ? c.bg : '#111827',
                        border: `1px solid ${severity === key ? c.border : '#1e293b'}`,
                        color: severity === key ? c.color : '#475569',
                        transition: 'all 0.15s',
                      }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>TARGET ZONE *</label>
                <select value={zone} onChange={e => setZone(e.target.value)}
                  style={{
                    width: '100%', background: '#111827', border: '1px solid #1e293b', borderRadius: 8,
                    padding: '8px 10px', color: '#f1f5f9', fontSize: 12, cursor: 'pointer', outline: 'none',
                  }}>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>MESSAGE BODY *</label>
                <span style={{ fontSize: 10, color: message.length > 400 ? '#ef4444' : '#475569' }}>{message.length}/500</span>
              </div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, 500))}
                placeholder="Write the alert message that will be sent to citizens…"
                rows={4}
                style={{
                  width: '100%', background: '#111827', border: `1px solid ${message.length > 0 ? cfg.border : '#1e293b'}`,
                  borderRadius: 8, padding: '10px 12px', color: '#f1f5f9', fontSize: 13, outline: 'none',
                  resize: 'vertical', fontFamily: 'Inter', lineHeight: 1.6, boxSizing: 'border-box',
                  transition: 'border 0.15s',
                }}
              />
              {/* Live Preview */}
              {message && (
                <div style={{ marginTop: 8, padding: '10px 12px', borderRadius: 8, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    {cfg.icon}
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>PREVIEW — {cfg.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#f1f5f9', lineHeight: 1.5 }}>{message}</div>
                </div>
              )}
            </div>

            {/* Delivery Channels */}
            <div>
              <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>DELIVERY CHANNELS</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {CHANNELS.map(ch => {
                  const active = channels.includes(ch.id);
                  return (
                    <button key={ch.id} onClick={() => toggleChannel(ch.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                        borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        background: active ? '#3b82f622' : '#111827',
                        border: `1px solid ${active ? '#3b82f644' : '#1e293b'}`,
                        transition: 'all 0.15s',
                      }}>
                      <span style={{ fontSize: 18 }}>{ch.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: active ? '#f1f5f9' : '#64748b' }}>{ch.label}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{ch.sub}</div>
                      </div>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                        background: active ? '#3b82f6' : '#1e293b',
                        border: `2px solid ${active ? '#3b82f6' : '#334155'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient Estimate + Send Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: '#111827', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Users size={16} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 600 }}>~{recipientEst} recipients</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>
                    {zone} via {channels.length > 0 ? channels.join(', ').toUpperCase() : 'no channels selected'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={onClose}
                  style={{ padding: '9px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #334155', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleSend}
                  disabled={!message.trim() || !title.trim() || channels.length === 0 || sending}
                  style={{
                    padding: '9px 20px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: (!message.trim() || !title.trim() || channels.length === 0) ? '#1e293b' : cfg.bg,
                    border: `1px solid ${(!message.trim() || !title.trim() || channels.length === 0) ? '#334155' : cfg.border}`,
                    color: (!message.trim() || !title.trim() || channels.length === 0) ? '#475569' : cfg.color,
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
                  }}>
                  {sending ? (
                    <>
                      <div style={{ width: 12, height: 12, border: `2px solid ${cfg.color}44`, borderTop: `2px solid ${cfg.color}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Sending…
                    </>
                  ) : (
                    <><Send size={13} /> Send Alert</>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default SendAlertModal;
