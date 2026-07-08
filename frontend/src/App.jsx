import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import './assets/styles.css';
import './index.css';

/**
 * Root component loading Global state contexts and router layout mappings
 */
function App() {
  return (
    <Router>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

export default App;
