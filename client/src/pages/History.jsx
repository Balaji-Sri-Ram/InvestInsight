import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from '../hooks/useHistory';
import { Spinner } from '../components/ui/Spinner';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

const History = () => {
  const { loading, error, reports } = useHistory();
  const navigate = useNavigate();

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRecommendationColor = (rec) => {
    switch (rec?.toUpperCase()) {
      case 'INVEST': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'HOLD': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DONT INVEST': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-[var(--color-secondary)] font-medium">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading History</h2>
        <p className="text-[var(--color-secondary)] mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-[var(--color-card)] rounded-full flex items-center justify-center mb-6 shadow-sm border border-[var(--color-border)]">
          <Search className="w-8 h-8 text-[var(--color-secondary)]" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Research History</h2>
        <p className="text-[var(--color-secondary)] mb-8 max-w-md">
          You haven't generated any AI investment reports yet. Start by searching for a company.
        </p>
        <Button onClick={() => navigate('/')}>Generate a Report</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Reports</h1>
        <p className="text-[var(--color-secondary)]">Your past AI investment analyses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {reports.map((report) => (
          <Card 
            key={report.id} 
            className="hover:shadow-subtle transition-all cursor-pointer group flex flex-col justify-between"
            onClick={() => navigate(`/report/${report.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0 flex-1 pr-4">
                  <h3 className="text-xl font-bold truncate" title={report.companyName}>
                    {report.companyName}
                  </h3>
                  {report.tickerSymbol && (
                    <span className="text-sm font-mono text-[var(--color-secondary)]">
                      #{report.tickerSymbol}
                    </span>
                  )}
                </div>
                <div className={cn("flex flex-col items-center justify-center w-12 h-12 rounded-lg border shrink-0", getScoreColor(report.investmentScore))}>
                  <span className="text-lg font-bold font-heading">{report.investmentScore}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className={cn("px-3 py-1 text-xs rounded-full font-semibold border uppercase tracking-wider", getRecommendationColor(report.recommendation))}>
                  {report.recommendation}
                </span>
                <span className="text-xs text-[var(--color-secondary)] flex items-center group-hover:text-[var(--color-primary)] transition-colors">
                  View Report <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;
