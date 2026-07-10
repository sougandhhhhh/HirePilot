'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredTheme, storeTheme, getSystemTheme, resolveTheme, applyTheme } from './themeUtils';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system');
  const [resolved, setResolved] = useState('dark');

  useEffect(() => {
    const stored = getStoredTheme();
    const res = resolveTheme(stored);
    setThemeState(stored);
    setResolved(res);
    applyTheme(res);
  }, []);

  useEffect(() => {
    const res = resolveTheme(theme);
    setResolved(res);
    applyTheme(res);
    storeTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      if (theme === 'system') {
        const res = getSystemTheme();
        setResolved(res);
        applyTheme(res);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((t) => {
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}