import React from 'react';

export type BadgeVariant = 'emerald' | 'amber' | 'indigo' | 'rose' | 'cyan' | 'violet';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'emerald', 
  children, 
  icon,
  style 
}) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'emerald': return 'badge badge-success';
      case 'amber': return 'badge badge-warning';
      case 'indigo': return 'badge badge-indigo';
      case 'rose': return 'badge badge-danger';
      case 'cyan': return 'badge badge-cyan';
      default: return 'badge badge-indigo';
    }
  };

  return (
    <span className={getBadgeClass()} style={style}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
