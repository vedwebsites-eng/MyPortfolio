import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'vex-portfolio-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {
      // ignore storage access error
    }
    return 'dark';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Apply theme classes and data-theme to <html>
  const applyThemeToDOM = useCallback((newTheme: Theme, animate = true) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }

    if (animate) {
      root.classList.add('theme-transitioning');
      setIsTransitioning(true);

      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }

      transitionTimerRef.current = setTimeout(() => {
        root.classList.remove('theme-transitioning');
        setIsTransitioning(false);
      }, 400);
    }
  }, []);

  // Update theme with smooth transition
  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (newTheme === theme) return;

      // Use document.startViewTransition if supported for fluid screen wipe/morph
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as any).startViewTransition(() => {
          setThemeState(newTheme);
          applyThemeToDOM(newTheme, true);
        });
      } else {
        setThemeState(newTheme);
        applyThemeToDOM(newTheme, true);
      }
    },
    [theme, applyThemeToDOM]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Initial sync on mount without transition animation
  useEffect(() => {
    applyThemeToDOM(theme, false);

    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
