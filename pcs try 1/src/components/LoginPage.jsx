import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';

const ADMIN_PASSCODE = 'AIRSENSE@ADMIN';

const DEMO_ACCOUNTS = [
  { email: 'admin@airsense.in', password: 'Admin@123', name: 'Admin', role: 'Administrator' },
  { email: 'officer@cpcb.gov.in', password: 'Cpcb@2024', name: 'CPCB Officer', role: 'Field Officer' },
];

const USER_ROLES = ['Public User', 'Field Officer', 'Policy Analyst', 'Data Scientist'];
const ADMIN_ROLES = ['Administrator', 'Field Officer', 'Policy Analyst', 'Data Scientist'];

const getUsers = () => JSON.parse(localStorage.getItem('airsense_users') || '[]');
const saveUsers = (users) => localStorage.setItem('airsense_users', JSON.stringify(users));

const InputField = ({ icon: Icon, type, placeholder, value, onChange, error, toggle, showPw, onToggle }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#111827', border: `1px solid ${error ? '#ef444466' : '#1e293b'}`,
      borderRadius: 10, padding: '0 14px', height: 46, transition: 'border 0.15s',
    }}
      onFocus={e => e.currentTarget.style.borderColor = error ? '#ef4444' : '#3b82f6'}
      onBlur={e => e.currentTarget.style.borderColor = error ? '#ef444466' : '#1e293b'}
    >
      <Icon size={15} color="#475569" />
      <input
        type={toggle ? (showPw ? 'text' : 'password') : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 13, fontFamily: 'Inter' }}
      />
      {toggle && (
        <button onClick={onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
          {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
    {error && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} />{error}</div>}
  </div>
);

const LoginPage = ({ onLogin }) => {
  const isMobile = useIsMobile();
  const [loginType, setLoginType] = useState('user'); // 'user' | 'admin'
  const [mode, setMode] = useState('signin');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Public User' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const switchLoginType = (type) => {
    setLoginType(type);
    setMode('signin');
    setErrors({});
    setSuccess('');
    setPasscode('');
    setPasscodeVerified(false);
    setForm({ name: '', email: '', password: '', confirm: '', role: type === 'admin' ? 'Administrator' : 'Public User' });
  };

  const verifyPasscode = () => {
    if (passcode === ADMIN_PASSCODE) {
      setPasscodeVerified(true);
      setErrors({});
    } else {
      setErrors({ passcode: 'Incorrect admin passcode' });
    }
  };

  const validate = () => {
    const e = {};
    if (mode === 'signup' && !form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'signup' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const allUsers = [...DEMO_ACCOUNTS, ...getUsers()];
      const user = allUsers.find(u => u.email === form.email && u.password === form.password);
      if (!user) { setErrors({ password: 'Invalid email or password' }); setLoading(false); return; }
      if (loginType === 'user' && user.role === 'Administrator') {
        setErrors({ password: 'Admin accounts must use the Admin Login tab' });
        setLoading(false);
        return;
      }
      setLoading(false);
      onLogin({ name: user.name, email: user.email, role: user.role || 'User', loginTime: new Date() });
    }, 1200);
  };

  const handleSignUp = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      const allUsers = [...DEMO_ACCOUNTS, ...users];
      if (allUsers.find(u => u.email === form.email)) {
        setErrors({ email: 'An account with this email already exists' });
        setLoading(false);
        return;
      }
      const newUser = { name: form.name.trim(), email: form.email, password: form.password, role: form.role };
      saveUsers([...users, newUser]);
      setSuccess('Account created! Signing you in…');
      setTimeout(() => onLogin({ name: newUser.name, email: newUser.email, role: newUser.role, loginTime: new Date() }), 1200);
    }, 1200);
  };

  const fillDemo = (acc) => {
    setForm(f => ({ ...f, email: acc.email, password: acc.password }));
    setErrors({});
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0f1e',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background radial glows */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, #3b82f615 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, #ef444410 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', width: '100%', maxWidth: isMobile ? 440 : 900, gap: 0, borderRadius: isMobile ? 16 : 20, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', border: '1px solid #1e293b' }}>

        {/* LEFT PANEL — Branding (hidden on mobile) */}
        <div style={{
          flex: 1, padding: '48px 40px', background: 'linear-gradient(145deg, #0f172a 0%, #111827 50%, #0a0f1e 100%)',
          display: isMobile ? 'none' : 'flex', flexDirection: 'column', justifyContent: 'space-between',
          borderRight: '1px solid #1e293b', minWidth: 0,
        }}>
          {/* Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌫</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9' }}>AirSense AI</div>
                <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.08em' }}>DELHI-NCR POLLUTION DASHBOARD</div>
              </div>
            </div>

            <div style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.25, marginBottom: 14 }}>
              AI-Driven Pollution<br />
              <span style={{ background: 'linear-gradient(90deg,#3b82f6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Monitoring & Response
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 32 }}>
              Real-time AQI tracking, AI source attribution, 72h LSTM forecasts, and GRAP policy management across 36 CPCB monitoring stations.
            </div>

            {/* Features list */}
            {[
              { icon: '📡', text: '36 CPCB Real-time Stations' },
              { icon: '🤖', text: 'AI Source Attribution (LSTM)' },
              { icon: '🔔', text: 'Live Alerts & Broadcast System' },
              { icon: '📋', text: 'GRAP Policy Management' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Demo accounts */}
          <div>
            <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.06em', marginBottom: 8 }}>DEMO ACCOUNTS — CLICK TO FILL</div>
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} onClick={() => { fillDemo(acc); setMode('signin'); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', marginBottom: 6, padding: '9px 12px', borderRadius: 8,
                  background: '#1e293b', border: '1px solid #334155', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#334155'}
                onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9' }}>{acc.name}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{acc.email}</div>
                </div>
                <span style={{ fontSize: 9, color: '#3b82f6', padding: '2px 7px', borderRadius: 10, background: '#3b82f622', fontWeight: 600 }}>{acc.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — Form */}
        <div style={{ width: isMobile ? '100%' : 400, flexShrink: 0, background: '#0f1729', padding: isMobile ? '32px 20px' : '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Mobile-only branding */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌫</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>AirSense AI</div>
                <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '0.08em' }}>DELHI-NCR POLLUTION DASHBOARD</div>
              </div>
            </div>
          )}

          {/* User / Admin toggle */}
          <div style={{ display: 'flex', background: '#0a0f1e', borderRadius: 10, padding: 3, marginBottom: 16, border: '1px solid #1e293b' }}>
            {[{ id: 'user', label: '👤 User Login' }, { id: 'admin', label: '🔐 Admin Login' }].map(t => (
              <button key={t.id} onClick={() => switchLoginType(t.id)}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: loginType === t.id ? 700 : 400, transition: 'all 0.15s',
                  background: loginType === t.id ? (t.id === 'admin' ? '#9333ea22' : '#3b82f622') : 'transparent',
                  color: loginType === t.id ? (t.id === 'admin' ? '#a855f7' : '#3b82f6') : '#475569',
                  borderBottom: loginType === t.id ? `2px solid ${t.id === 'admin' ? '#9333ea' : '#3b82f6'}` : '2px solid transparent',
                }}>{t.label}</button>
            ))}
          </div>

          {/* Admin passcode gate */}
          {loginType === 'admin' && !passcodeVerified && (
            <div style={{ marginBottom: 18, padding: 16, borderRadius: 10, background: '#9333ea11', border: '1px solid #9333ea33' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#a855f7', marginBottom: 4 }}>Admin Access Required</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>Enter the admin passcode to access administrator login.</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#111827', border: `1px solid ${errors.passcode ? '#ef444466' : '#1e293b'}`, borderRadius: 8, padding: '0 12px', height: 40 }}>
                  <Lock size={13} color="#475569" />
                  <input type={showPasscode ? 'text' : 'password'} placeholder="Admin passcode" value={passcode} onChange={e => setPasscode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && verifyPasscode()}
                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: 12, fontFamily: 'Inter' }} />
                  <button onClick={() => setShowPasscode(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>{showPasscode ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                </div>
                <button onClick={verifyPasscode} style={{ padding: '0 14px', height: 40, borderRadius: 8, background: '#9333ea', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Verify</button>
              </div>
              {errors.passcode && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={11} />{errors.passcode}</div>}
            </div>
          )}

          {/* Sign In / Sign Up tabs */}
          {(loginType === 'user' || passcodeVerified) && (
            <div style={{ display: 'flex', background: '#111827', borderRadius: 10, padding: 3, marginBottom: 16, border: '1px solid #1e293b' }}>
              {['signin', 'signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setErrors({}); setSuccess(''); }}
                  style={{ flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer', background: mode === m ? '#1e293b' : 'transparent', color: mode === m ? '#f1f5f9' : '#475569', fontSize: 13, fontWeight: mode === m ? 700 : 400, transition: 'all 0.15s' }}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>
              {loginType === 'admin' && !passcodeVerified ? 'Admin Access' : mode === 'signin' ? 'Welcome back' : 'Create account'}
            </div>
            <div style={{ fontSize: 12, color: '#475569' }}>
              {loginType === 'admin' && !passcodeVerified ? 'Restricted to authorised personnel only' : mode === 'signin' ? `Sign in as a ${loginType === 'admin' ? 'system administrator' : 'user'}` : 'Register for a new user account'}
            </div>
          </div>

          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, background: '#22c55e22', border: '1px solid #22c55e44', marginBottom: 14 }}>
              <CheckCircle size={14} color="#22c55e" />
              <span style={{ fontSize: 12, color: '#22c55e' }}>{success}</span>
            </div>
          )}

          {/* Form Fields — only show when passcode verified (admin) or user mode */}
          {(loginType === 'user' || passcodeVerified) && (
            <>
              {mode === 'signup' && (
                <InputField icon={User} type="text" placeholder="Full Name" value={form.name} onChange={set('name')} error={errors.name} />
              )}
              <InputField icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={set('email')} error={errors.email} />
              <InputField icon={Lock} type="password" placeholder="Password" value={form.password} onChange={set('password')} error={errors.password} toggle showPw={showPw} onToggle={() => setShowPw(v => !v)} />
              {mode === 'signup' && (
                <>
                  <InputField icon={Lock} type="password" placeholder="Confirm Password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} toggle showPw={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 6 }}>ROLE</label>
                    <select value={form.role} onChange={set('role')}
                      style={{ width: '100%', background: '#111827', border: '1px solid #1e293b', borderRadius: 10, padding: '11px 14px', color: '#f1f5f9', fontSize: 13, cursor: 'pointer', outline: 'none' }}>
                      {(loginType === 'admin' ? ADMIN_ROLES : USER_ROLES).map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                onClick={mode === 'signin' ? handleSignIn : handleSignUp}
                disabled={loading}
                style={{
                  width: '100%', height: 46, borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#1e293b' : loginType === 'admin' ? 'linear-gradient(135deg,#9333ea,#7c3aed)' : 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                  color: loading ? '#475569' : '#fff', fontSize: 14, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'opacity 0.15s', fontFamily: 'Inter',
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 14, height: 14, border: '2px solid #47556966', borderTop: '2px solid #94a3b8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    {mode === 'signin' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : (
                  <>{mode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={15} /></>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: '#475569' }}>
                {mode === 'signin'
                  ? <span>No account? <button onClick={() => { setMode('signup'); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Sign Up</button></span>
                  : <span>Have an account? <button onClick={() => { setMode('signin'); setErrors({}); }} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Sign In</button></span>
                }
              </div>
            </>
          )}

          <div style={{ marginTop: 20, padding: '12px', borderRadius: 8, background: '#111827', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: 10, color: '#334155', textAlign: 'center', lineHeight: 1.6 }}>
              Data sources: CPCB • SAFAR • IMD<br />
              AirSense AI v1.0 — Delhi-NCR Pollution Dashboard
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default LoginPage;
