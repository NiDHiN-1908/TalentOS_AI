import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by TalentOS ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#07090e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'var(--font-main)',
          color: '#fff'
        }}>
          <div className="glass-card" style={{ maxWidth: '520px', width: '100%', padding: '32px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#f43f5e" style={{ marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
              System Error Caught by Shield
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
              An unexpected UI execution error occurred. The TalentOS Error Boundary prevented application crash.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.3)',
                padding: '12px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#fb7185',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                {this.state.error.message}
              </div>
            )}

            <button onClick={this.handleReset} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <RefreshCw size={16} /> Reload TalentOS Engine
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
