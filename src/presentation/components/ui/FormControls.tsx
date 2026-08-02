import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input 
        className={`form-input ${className}`} 
        style={style}
        {...props} 
      />
      {error && (
        <span style={{ fontSize: '0.72rem', color: 'var(--accent-rose)' }}>
          {error}
        </span>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, style, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <select 
        className="form-input"
        style={{ cursor: 'pointer', ...style }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
