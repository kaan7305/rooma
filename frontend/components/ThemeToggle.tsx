'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-md"
        aria-label="Toggle theme"
      >
        {effectiveTheme === 'dark' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        )}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 space-y-1">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      console.log('[ThemeToggle] Button clicked for theme:', themeOption.value);
                      setTheme(themeOption.value);
                      setShowMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{themeOption.label}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Current: {effectiveTheme === 'dark' ? 'Dark' : 'Light'}
                {theme === 'system' && ' (Auto)'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
