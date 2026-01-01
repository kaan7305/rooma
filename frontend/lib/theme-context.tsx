'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Check system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Calculate effective theme based on user preference and system settings
  const calculateEffectiveTheme = (userTheme: Theme): 'light' | 'dark' => {
    if (userTheme === 'system') {
      return getSystemTheme();
    }
    return userTheme;
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
      const effective = calculateEffectiveTheme(savedTheme);
      setEffectiveTheme(effective);

      // Ensure the class is applied (should already be from blocking script)
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(effective);
    } else {
      const systemTheme = getSystemTheme();
      setEffectiveTheme(systemTheme);
      setThemeState('system');

      // Apply system theme
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setEffectiveTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

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
    setThemeState(newTheme);
    setEffectiveTheme(calculateEffectiveTheme(newTheme));
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'system') {
      const currentEffective = calculateEffectiveTheme('system');
      const newTheme = currentEffective === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    } else {
      const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }
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
