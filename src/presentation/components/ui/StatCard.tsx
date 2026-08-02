import React from 'react';
import { Badge, BadgeVariant } from './Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeVariant = 'emerald',
  icon,
  onClick
}) => {
  return (
    <div 
      className="glass-card-interactive" 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ 
          fontSize: '0.72rem', 
          color: 'var(--text-muted)', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {title}
        </span>
        {badgeText && (
          <Badge variant={badgeVariant}>
            {badgeText}
          </Badge>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
          {value}
        </div>
        {icon && (
          <div style={{ color: 'var(--accent-emerald)' }}>
            {icon}
          </div>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
