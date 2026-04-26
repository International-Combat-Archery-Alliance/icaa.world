import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { initNewRelic } from '@/lib/newrelic';
import { initOtel } from '@/lib/otel';
import { Toaster } from '@/components/ui/sonner';

// Initialize observability before React render
initNewRelic().then(() => {
  initOtel();
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
      <Toaster />
    </React.StrictMode>,
  );
});
