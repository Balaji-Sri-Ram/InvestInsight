import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Apply class without transition to avoid initial flash
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const fallbackRipple = (e, nextTheme) => {
    // Get new background color matching CSS variables
    const bgColor = nextTheme === 'dark' ? '#121212' : '#FBFBF9';
    
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = bgColor;
    ripple.style.zIndex = '9999';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'all 700ms ease-in-out';
    ripple.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(ripple);

    // Trigger reflow
    void ripple.offsetWidth;
    
    ripple.style.width = `${endRadius * 2}px`;
    ripple.style.height = `${endRadius * 2}px`;

    setTimeout(() => {
      setTheme(nextTheme);
      setTimeout(() => ripple.remove(), 50);
    }, 650);
  };

  const toggleTheme = (e) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    
    if (!document.startViewTransition) {
      fallbackRipple(e, nextTheme);
      return;
    }

    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      
      document.documentElement.animate(
        { clipPath },
        {
          duration: 700,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
