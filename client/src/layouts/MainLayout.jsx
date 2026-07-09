import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { History as HistoryIcon, Home as HomeIcon, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      {/* Top Navbar */}
      <header className="w-full h-16 bg-[var(--color-sidebar)] backdrop-blur-md border-b border-[var(--color-border)] flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
        <Link to="/" className="flex items-center text-[var(--color-logo)] hover:opacity-80 transition-opacity group">
          <div className="flex items-end">
            <div 
              className="h-10 w-7 bg-current shrink-0 -mr-1" 
              style={{
                WebkitMaskImage: "url('/I.png')",
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "bottom center",
                WebkitMaskRepeat: "no-repeat",
                maskImage: "url('/I.png')",
                maskSize: "contain",
                maskPosition: "bottom center",
                maskRepeat: "no-repeat"
              }}
            />
            <span className="font-heading font-bold text-xl tracking-widest leading-none mb-[3px]">NVEST</span>
            <div 
              className="h-10 w-7 bg-current shrink-0 -ml-1.5 -mr-1" 
              style={{
                WebkitMaskImage: "url('/I.png')",
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "bottom center",
                WebkitMaskRepeat: "no-repeat",
                maskImage: "url('/I.png')",
                maskSize: "contain",
                maskPosition: "bottom center",
                maskRepeat: "no-repeat"
              }}
            />
            <span className="font-heading font-bold text-xl tracking-widest leading-none mb-[3px]">NSIGHT</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4">
          <button 
            onClick={(e) => toggleTheme(e)}
            className="p-2 rounded-full hover:bg-[var(--color-border)]/50 transition-colors text-[var(--color-secondary)] hover:text-[var(--color-heading)]"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <Link 
            to="/" 
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-card)]",
              location.pathname === '/' ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5" : "text-[var(--color-secondary)]"
            )}
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link 
            to="/history" 
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-[var(--color-card)]",
              location.pathname === '/history' ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5" : "text-[var(--color-secondary)]"
            )}
          >
            <HistoryIcon className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Link>
        </nav>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
