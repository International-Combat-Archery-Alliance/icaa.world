import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { initNewRelic } from '@/lib/newrelic';

// Initialize New Relic before React render (production only)
initNewRelic().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
