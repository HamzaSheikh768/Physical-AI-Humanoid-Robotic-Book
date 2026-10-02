import React from 'react';
import styles from './auth.module.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

class AuthErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

const DefaultFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className={styles.errorBoundary}>
    <div className={styles.error}>
      <h2>Something went wrong</h2>
      {error?.message && (
        <p>
          <strong>Error:</strong> {error.message}
        </p>
      )}
      <p>Please refresh the page or contact support if the problem persists.</p>
      <button
        className={styles.submitButton}
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button>
    </div>
  </div>
);

export default AuthErrorBoundary;