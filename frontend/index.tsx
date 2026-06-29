import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '40px', fontFamily: 'sans-serif', background: '#F4F3EE', minHeight: '100vh'}}>
          <h1 style={{color: '#9C7A3C', fontSize: '24px', marginBottom: '16px'}}>Mandate Vacuum</h1>
          <p style={{color: '#666', marginBottom: '8px'}}>Dashboard loading error:</p>
          <pre style={{background: '#fff', padding: '16px', borderRadius: '8px', fontSize: '12px', color: 'red'}}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

ReactDOM.createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
