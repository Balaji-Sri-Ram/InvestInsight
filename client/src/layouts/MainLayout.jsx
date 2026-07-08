import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';
import { History as HistoryIcon, Home as HomeIcon } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      {/* Top Navbar */}
      <header className="w-full h-16 bg-[var(--color-sidebar)] border-b border-[var(--color-border)] flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded bg-[var(--color-primary)] flex items-center justify-center text-white font-bold font-heading">
            I
          </div>
          <span className="font-heading font-semibold text-lg text-[var(--color-heading)] tracking-tight">InvestInsight</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4">
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
