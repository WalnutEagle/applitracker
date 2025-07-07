import React, { createContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Theme } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const defaultState: ThemeContextType = {
  theme: 'default',
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultState);

const themes: Record<Theme, Record<string, string>> = {
  default: {
    '--primary-500': '#3b82f6',
    '--primary-600': '#2563eb',
    '--primary-700': '#1d4ed8',
    '--secondary-500': '#4b5563',
    '--secondary-600': '#374151',
    '--secondary-700': '#1f2937',
    '--accent-300': '#93c5fd',
    '--accent-400': '#60a5fa',
    '--accent-teal-300': '#5eead4',
    '--text-main': '#e5e7eb',
    '--text-light': '#9ca3af',
    '--text-dark': '#f9fafb',
    '--bg-main': '#111827',
    '--bg-card': 'rgba(31, 41, 55, 0.5)',
    '--bg-input': 'rgba(17, 24, 39, 0.5)',
    '--border-color': 'rgba(55, 65, 81, 0.5)',
    '--focus-ring': '#3b82f6',
  },
  sunset: {
    '--primary-500': '#f97316',
    '--primary-600': '#ea580c',
    '--primary-700': '#c2410c',
    '--secondary-500': '#57534e',
    '--secondary-600': '#44403c',
    '--secondary-700': '#292524',
    '--accent-300': '#fdba74',
    '--accent-400': '#fb923c',
    '--accent-teal-300': '#fda4af',
    '--text-main': '#e7e5e4',
    '--text-light': '#a8a29e',
    '--text-dark': '#fafaf9',
    '--bg-main': '#1c1917',
    '--bg-card': 'rgba(41, 37, 36, 0.5)',
    '--bg-input': 'rgba(28, 25, 23, 0.5)',
    '--border-color': 'rgba(68, 64, 60, 0.5)',
    '--focus-ring': '#f97316',
  },
  graphite: {
    '--primary-500': '#f9fafb',
    '--primary-600': '#f3f4f6',
    '--primary-700': '#e5e7eb',
    '--secondary-500': '#4b5563',
    '--secondary-600': '#374151',
    '--secondary-700': '#1f2937',
    '--accent-300': '#d1d5db',
    '--accent-400': '#e5e7eb',
    '--accent-teal-300': '#f9fafb',
    '--text-main': '#d1d5db',
    '--text-light': '#9ca3af',
    '--text-dark': '#111827',
    '--bg-main': '#030712',
    '--bg-card': 'rgba(17, 24, 39, 0.7)',
    '--bg-input': 'rgba(3, 7, 18, 0.5)',
    '--border-color': 'rgba(55, 65, 81, 0.5)',
    '--focus-ring': '#f9fafb',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>(LOCAL_STORAGE_KEYS.THEME, 'default');

  useEffect(() => {
    const root = window.document.documentElement;
    const newTheme = themes[theme];

    Object.entries(newTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Special case for Graphite theme primary button text
    if (theme === 'graphite') {
        root.style.setProperty('--text-dark', '#111827');
    }

  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
