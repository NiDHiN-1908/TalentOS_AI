import React from 'react';
import { Lock } from 'lucide-react';
import { authStore } from '../../infrastructure/store/authStore';

interface RBXGuardProps {
  moduleId?: string;
  requiredPermission?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const RBXGuard: React.FC<RBXGuardProps> = ({ 
  moduleId, 
  requiredPermission, 
  fallback, 
  children 
}) => {
  const [authorized, setAuthorized] = React.useState(() => {
    if (moduleId && !authStore.canAccessModule(moduleId)) return false;
    if (requiredPermission && !authStore.hasPermission(requiredPermission)) return false;
    return true;
  });

  const persona = authStore.getCurrentPersona();

  React.useEffect(() => {
    const update = () => {
      let isAuth = true;
      if (moduleId && !authStore.canAccessModule(moduleId)) isAuth = false;
      if (requiredPermission && !authStore.hasPermission(requiredPermission)) isAuth = false;
      setAuthorized(isAuth);
    };
    update();
    return authStore.subscribe(update);
  }, [moduleId, requiredPermission]);

  if (!authorized) {
    if (fallback) return <>{fallback}</>;

    return (
      <div style={{
        padding: '60px 24px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--accent-rose-subtle)',
        borderRadius: 'var(--radius-md)',
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
          backgroundColor: 'var(--accent-rose-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <Lock size={28} color="var(--accent-rose)" />
        </div>

        <span className="badge badge-danger" style={{ marginBottom: '10px' }}>
          403 FORBIDDEN — ACCESS DENIED
        </span>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
          Unauthorized Module Access
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '520px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          Your current active persona (<strong style={{ color: 'var(--text-primary)' }}>{persona.name} — {persona.role}</strong>) does not have authorization to view or execute operations in this domain.
        </p>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-canvas)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          To test this module, switch your active persona using the RBX Persona Selector in the top navigation bar.
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
