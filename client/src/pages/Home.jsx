import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../hooks/useResearch';
import { Button } from '../components/ui/Button';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

const Home = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { generateReport, loading, error, progressMessage, resetError } = useResearch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    resetError();
    
    const result = await generateReport(query);
    if (result && result.id) {
      // Navigate to the report page once successfully generated
      navigate(`/report/${result.id}`, { state: { isNew: true } });
    }
  };

  return (
    <>
      {loading && <LoadingOverlay currentMessage={progressMessage} />}
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wide text-[var(--color-accent)] bg-[var(--color-accent)]/10 rounded-full">
          AI-Powered Insights
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Institutional Grade Research, <br className="hidden md:block"/>
          <span className="text-[var(--color-primary)]">In Seconds.</span>
        </h1>
        <p className="max-w-2xl text-[var(--color-secondary)] text-lg mb-8">
          Enter a company name to generate a comprehensive investment research report analyzing financials, market position, and risks.
        </p>
        
        <form onSubmit={handleAnalyze} className="w-full max-w-xl relative flex flex-col items-center">
          <div className="w-full relative flex flex-col items-center" ref={dropdownRef}>
            <div className="w-full relative flex items-center">
              <input 
                type="text" 
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                disabled={loading}
                placeholder="e.g. Nvidia, Apple, Tesla..." 
                className="w-full pl-5 pr-32 py-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-heading)] placeholder:text-[var(--color-secondary)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all disabled:opacity-50"
              />
              <div className="absolute right-2">
                <Button 
                  type="submit" 
                  disabled={loading || !query.trim()}
                  className="h-10 px-6"
                >
                  Analyze
                </Button>
              </div>
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-20 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((company, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-border)]/50 cursor-pointer transition-colors border-b border-[var(--color-border)] last:border-0"
                    onClick={() => {
                      setQuery(company.name);
                      setShowSuggestions(false);
                    }}
                  >
                    <img 
                      src={company.logo || `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`} 
                      alt={`${company.name} logo`} 
                      className="w-8 h-8 object-contain shrink-0"
                      onError={(e) => { e.target.src = '/I.png'; e.target.className = "w-8 h-8 rounded-md object-contain opacity-50 shrink-0"; }}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-[var(--color-heading)]">{company.name}</span>
                      <span className="text-xs text-[var(--color-secondary)]">{company.domain}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg w-full text-left">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Home;
