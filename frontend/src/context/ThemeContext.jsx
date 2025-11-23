import React, { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {}, toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or system preference before first render
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return saved || (prefersDark ? 'dark' : 'light');
  });

  // (removed mount effect for theme hydration; handled by lazy initializer)

  // Apply theme attribute before paint and persist
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => t === 'light' ? 'dark' : 'light'),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}