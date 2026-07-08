import React from 'react';

/**
 * ErrorBoundary — Class component that catches React rendering errors anywhere
 * in the component subtree and renders a graceful fallback UI instead of
 * white-screening the app.
 *
 * Usage: Wrap <AppRoutes /> (or any subtree) in App.jsx once to cover everything.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console in dev; replace with Sentry/Datadog hook if needed in prod
    console.error('[ErrorBoundary] Caught an unhandled React error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#030712',
            color: '#f1f5f9',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '480px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            An unexpected error occurred while rendering the page. This is likely a transient issue.
          </p>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <pre
              style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '1rem',
                fontSize: '0.75rem',
                color: '#f87171',
                maxWidth: '600px',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              {this.state.error.toString()}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            style={{
              background: '#fff',
              color: '#030712',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.75rem 2rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
