import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Intercept malformed URL before React and React Router load
try {
  decodeURIComponent(window.location.pathname);
} catch (e) {
  if (e instanceof URIError) {
    window.history.replaceState(null, '', '/not-found');
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

