'use client';

export const THEME_STORAGE_KEY = 'hirepilot-theme';

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {}
  return 'system';
}

export function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

export function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function resolveTheme(theme) {
  return theme === 'system' ? getSystemTheme() : theme;
}

export function applyTheme(resolved) {
  document.documentElement.setAttribute('data-theme', resolved);
}

export function initTheme() {
  const stored = getStoredTheme();
  const resolved = resolveTheme(stored);
  applyTheme(resolved);
  return { stored, resolved };
}