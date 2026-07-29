import React, { useState } from 'react';
import { Lock, Key, Shield, User, RefreshCw, CheckCircle2, AlertTriangle, Smartphone, Trash2, KeyRound } from 'lucide-react';
import { AuthService } from '../../application/services/AuthService';
import { UserRole, ROLE_PERMISSIONS_MATRIX, PermissionCode } from '../../domain/types/auth';

export const AuthView: React.FC = () => {
  const [email, setEmail] = useState('user@talentos.ai');
  const [password, setPassword] = useState('password123');
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeSessions, setActiveSessions] = useState(AuthService.getActiveSessions());
  const [resetToken, setResetToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const session = await AuthService.login(email, password);
      setCurrentUser(session.user);
      setActiveSessions(AuthService.getActiveSessions());
      setSuccessMsg(`Authenticated cleanly as ${session.user.fullName} (${session.user.role})!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    }
  };

  const handleRoleChange = (role: UserRole) => {
    AuthService.setCurrentUserRole(role);
    setCurrentUser(AuthService.getCurrentUser());
    setSuccessMsg(`Switched role context to: ${role}`);
  };

  const handleRevoke = (sessionId: string) => {
    AuthService.revokeSession(sessionId);
    setActiveSessions(AuthService.getActiveSessions());
  };

  const handleRequestPasswordReset = () => {
    const token = AuthService.requestPasswordReset(currentUser.email);
    setResetToken(token);
    setSuccessMsg(`Password reset token generated: ${token}`);
  };

  const allPermissions: PermissionCode[] = [
    'org:manage', 'employees:read', 'employees:write', 
    'payroll:read', 'payroll:approve', 'candidates:read', 
    'candidates:write', 'agent:dispatch', 'audit:read'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Lock size={22} color="#a855f7" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Auth & Security Control Center</h2>
            <span className="badge badge-purple">JWT + OAuth2 + RLS</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Multi-tenant organization isolation, RBAC permission matrix enforcement, session management, and rate limiting.
          </p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '10px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{currentUser.fullName}</div>
          <div style={{ fontSize: '0.72rem', color: '#a855f7' }}>Active Role: {currentUser.role}</div>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Authentication & Role Switcher */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="#6366f1" /> Authenticate User & Role Context
          </h3>

          {errorMsg && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '14px' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '14px' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Work Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Password (Demo: password123)</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '6px' }}>
              <KeyRound size={16} /> Authenticate & Issue JWT
            </button>
          </form>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px', color: '#cbd5e1' }}>Simulate Dynamic RBAC Role Context:</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER', 'EMPLOYEE', 'AUDITOR'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  style={{
                    background: currentUser.role === r ? '#6366f1' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: '1px solid var(--border-glass)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permission Matrix Inspector */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#10b981" /> Active RBAC Permission Matrix ({currentUser.role})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {allPermissions.map((perm) => {
              const isAllowed = AuthService.hasPermission(currentUser, perm);
              return (
                <div key={perm} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: isAllowed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '6px',
                  border: isAllowed ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: isAllowed ? '#fff' : '#64748b' }}>
                    {perm}
                  </span>
                  <span className={isAllowed ? 'badge badge-emerald' : 'badge badge-rose'}>
                    {isAllowed ? 'ALLOWED' : 'DENIED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Active Device Sessions Manager */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} color="#6366f1" /> Active Device Sessions ({activeSessions.length})
          </h3>
          <button onClick={handleRequestPasswordReset} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            <RefreshCw size={14} /> Request Password Reset Token
          </button>
        </div>

        {activeSessions.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '20px 0', textAlign: 'center' }}>
            No active sessions. Authenticate via login above to issue JWT tokens.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeSessions.map((sess) => (
              <div key={sess.sessionId} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0,0,0,0.3)',
                padding: '12px 14px',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>
                    {sess.deviceInfo} ({sess.ipAddress})
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    Session ID: {sess.sessionId} • Issued: {new Date(sess.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <button onClick={() => handleRevoke(sess.sessionId)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#fb7185' }}>
                  <Trash2 size={14} /> Revoke Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
