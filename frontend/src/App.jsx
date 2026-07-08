import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import './assets/styles.css';
import './index.css';

/**
 * Root component loading Global state contexts and router layout mappings.
 * Wrapped in ErrorBoundary so unhandled render errors show a graceful fallback
 * instead of a blank white screen.
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
