import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

function RootApp() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);

// Listen for sidebar (or any component) theme-change events
window.addEventListener('theme-change', (e) => {
  const isDark = e?.detail?.isDark;
  const root = document.documentElement;
  if (isDark) root.classList.add('dark');
  else root.classList.remove('dark');
});

// Sync theme across browser tabs (when localStorage changes)
window.addEventListener('storage', (e) => {
  if (e.key === 'theme') {
    const root = document.documentElement;
    if (e.newValue === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }
});
