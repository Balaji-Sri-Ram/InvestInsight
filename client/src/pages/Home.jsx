import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../hooks/useResearch';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';

const Home = () => {
  const [query, setQuery] = useState('');
  const { generateReport, loading, error, resetError } = useResearch();
  const navigate = useNavigate();

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
        <div className="w-full relative flex items-center">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="e.g. Nvidia, Apple, Tesla..." 
            className="w-full pl-5 pr-32 py-4 rounded-xl border border-[var(--color-border)] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all disabled:opacity-50"
          />
          <div className="absolute right-2">
            <Button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="h-10 px-6"
            >
              {loading ? <Spinner size="sm" className="mr-2 border-t-white border-r-white" /> : null}
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg w-full text-left">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default Home;
