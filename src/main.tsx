import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle any benign WebSocket/HMR disconnection rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = String(reason?.message || reason?.stack || reason || '').toLowerCase();
    if (
      msg.includes('websocket') || 
      msg.includes('closed without opened') || 
      msg.includes('failed to connect') ||
      msg.includes('[vite]')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = String(event?.message || event?.error?.message || '').toLowerCase();
    if (
      msg.includes('websocket') || 
      msg.includes('closed without opened') || 
      msg.includes('failed to connect') ||
      msg.includes('[vite]')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation?.();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
