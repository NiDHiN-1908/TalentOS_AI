import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { authStore } from '../../infrastructure/store/authStore';

interface RBXGuardProps {
  moduleId: string;
  children: React.ReactNode;
}

export const RBXGuard: React.FC<RBXGuardProps> = ({ moduleId, children }) => {
  const [canAccess, setCanAccess] = React.useState(authStore.canAccessModule(moduleId));
  const persona = authStore.getCurrentPersona();

  React.useEffect(() => {
    const update = () => setCanAccess(authStore.canAccessModule(moduleId));
    update();
    return authStore.subscribe(update);
  }, [moduleId]);

  if (!canAccess) {
    return (
      <div style={{
        padding: '60px 24px',
        backgroundColor: '#111726',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        borderRadius: '10px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px 0'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(244, 63, 94, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Lock size={28} color="#f43f5e" />
        </div>

        <span className="badge badge-warning" style={{ marginBottom: '10px', backgroundColor: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
          403 FORBIDDEN — ACCESS DENIED
        </span>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 8px 0' }}>
          Unauthorized Module Access
        </h3>

        <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '520px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          Your current active persona (<strong style={{ color: '#f8fafc' }}>{persona.name} — {persona.role}</strong>) does not have authorization to view or execute operations in this domain.
        </p>

        <div style={{ fontSize: '0.78rem', color: '#64748b', backgroundColor: '#090d16', padding: '10px 16px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          To test this module, switch your active persona to <strong style={{ color: '#10b981' }}>HR Manager</strong> or <strong style={{ color: '#10b981' }}>Platform Admin</strong> using the Role Switcher in the top navigation bar.
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
