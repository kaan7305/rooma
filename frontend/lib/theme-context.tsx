'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage
  useEffect(() => {
    // Force clean any invalid theme values
    const savedTheme = localStorage.getItem('theme');
    console.log('[Theme Init] Raw localStorage value:', savedTheme);

    // If it's not exactly 'light' or 'dark', clear it
    if (savedTheme !== 'light' && savedTheme !== 'dark') {
      console.log('[Theme Init] Invalid theme detected, clearing and setting to light');
      localStorage.removeItem('theme');
      localStorage.setItem('theme', 'light');
    }

    const validTheme = (localStorage.getItem('theme') as Theme) || 'light';
    console.log('[Theme Init] Using theme:', validTheme);

    setThemeState(validTheme);
    setEffectiveTheme(validTheme);

    // Apply the class to document - force remove ALL possible classes first
    const root = window.document.documentElement;
    root.className = root.className
      .split(' ')
      .filter(c => c !== 'light' && c !== 'dark')
      .join(' ');
    root.classList.add(validTheme);

    console.log('[Theme Init] Final HTML classes:', root.className);
    console.log('[Theme Init] Has light class:', root.classList.contains('light'));
    console.log('[Theme Init] Has dark class:', root.classList.contains('dark'));
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#1f2937' : '#ffffff');
    }
  }, [effectiveTheme]);

  const setTheme = (newTheme: Theme) => {
    console.log('[Theme] Setting theme to:', newTheme);

    // Update state
    setThemeState(newTheme);
    setEffectiveTheme(newTheme);

    // Update localStorage
    localStorage.setItem('theme', newTheme);
    console.log('[Theme] Saved to localStorage:', newTheme);

    // IMMEDIATELY update DOM (don't wait for useEffect)
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    console.log('[Theme] Applied class to HTML:', newTheme);
    console.log('[Theme] HTML classes now:', root.className);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
