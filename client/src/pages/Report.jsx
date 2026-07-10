import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useReport } from '../hooks/useReport';
import { ReportSkeleton } from '../components/ui/Skeleton';
import { TypewriterText } from '../components/ui/TypewriterText';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Briefcase, Activity, Target, Globe, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.state?.isNew === true;
  const { report, loading, error } = useReport(id);
  const [websiteUrl, setWebsiteUrl] = React.useState('');

  React.useEffect(() => {
    if (report?.companyName) {
      const nameLower = report.companyName.toLowerCase();
      if (nameLower === 'tcs' || nameLower.includes('tata consultancy')) {
        setWebsiteUrl('https://tcs.com');
        return;
      }
      
      fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(report.companyName)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0 && data[0].domain) {
            setWebsiteUrl(`https://${data[0].domain}`);
          }
        })
        .catch(console.error);
    }
  }, [report?.companyName]);

  if (loading) {
    if (isNew) {
      return (
        <div className="pt-4 max-w-7xl mx-auto">
          <ReportSkeleton />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Spinner size="lg" className="mb-4" />
        <p className="text-[var(--color-secondary)] font-medium">Fetching research report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-[var(--color-secondary)] mb-6 max-w-md">
          {error || "We couldn't find the requested investment report. It may have been deleted."}
        </p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  const {
    companyName,
    tickerSymbol,
    investmentScore,
    recommendation,
    analysisDetails
  } = report;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getRecommendationColor = (rec) => {
    switch (rec?.toUpperCase()) {
      case 'INVEST': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'HOLD': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'DONT INVEST': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
        <div className="text-sm text-[var(--color-secondary)]">
          Generated on {new Date(report.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-border)] pb-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {companyName}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {tickerSymbol && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-mono font-semibold text-sm border border-[var(--color-primary)]/20 shadow-sm transition-all hover:bg-[var(--color-primary)]/20 cursor-default">
                #{tickerSymbol}
              </span>
            )}
            {websiteUrl && (
              <a 
                href={websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-medium text-sm transition-colors group"
              >
                <Globe className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" />
                <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-[var(--color-primary)] after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100">
                  {websiteUrl.replace('https://', '').replace('www.', '')}
                </span>
                <ExternalLink className="w-3 h-3 ml-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-[var(--color-secondary)] uppercase tracking-wider mb-1">
              Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className={cn("text-4xl font-bold font-heading", getScoreColor(investmentScore))}>
                <AnimatedNumber value={investmentScore} disableAnimation={!isNew} />
              </span>
              <span className="text-[var(--color-secondary)] font-medium">/100</span>
            </div>
          </div>

          <div className="h-12 w-px bg-[var(--color-border)]"></div>

          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-[var(--color-secondary)] uppercase tracking-wider mb-2">
              Action
            </span>
            <span className={cn("px-4 py-1.5 rounded-full font-bold tracking-wide border", getRecommendationColor(recommendation))}>
              {recommendation}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Detailed Analysis */}
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[var(--color-primary)]" />
              Company Overview
            </h2>
            <div className="prose prose-slate max-w-none text-[var(--color-secondary)] leading-relaxed dark:prose-invert">
              <TypewriterText text={analysisDetails?.overview} speed={2} disableAnimation={!isNew} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-[var(--color-primary)]" />
              Business Model
            </h2>
            <div className="prose prose-slate max-w-none text-[var(--color-secondary)] leading-relaxed dark:prose-invert">
              <TypewriterText text={analysisDetails?.businessModel} speed={2} disableAnimation={!isNew} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-[var(--color-primary)]" />
              Financial Health & Valuation
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="text-[var(--color-secondary)] leading-relaxed prose prose-slate max-w-none dark:prose-invert">
                  <TypewriterText text={analysisDetails?.financials} speed={2} disableAnimation={!isNew} />
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Final Reasoning</h2>
            <div className="p-6 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 text-[var(--color-heading)] leading-relaxed font-medium prose prose-slate max-w-none dark:prose-invert">
              <TypewriterText text={analysisDetails?.reasoning} speed={2} disableAnimation={!isNew} />
            </div>
          </section>
          
        </div>

        {/* Right Column - SWOT & Market */}
        <div className="space-y-6">
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <TrendingUp className="w-5 h-5" />
                Catalysts & Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-[var(--color-secondary)] leading-relaxed prose prose-slate prose-sm max-w-none dark:prose-invert">
                <TypewriterText text={analysisDetails?.growthOps} speed={2} disableAnimation={!isNew} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <TrendingDown className="w-5 h-5" />
                Risks & Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-[var(--color-secondary)] leading-relaxed prose prose-slate prose-sm max-w-none dark:prose-invert">
                <TypewriterText text={analysisDetails?.risks} speed={2} disableAnimation={!isNew} />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Bottom Section - Market & Competitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Market Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-[var(--color-secondary)] leading-relaxed prose prose-slate prose-sm max-w-none dark:prose-invert">
              <TypewriterText text={analysisDetails?.marketPosition} speed={2} disableAnimation={!isNew} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Competitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-[var(--color-secondary)] leading-relaxed prose prose-slate prose-sm max-w-none dark:prose-invert">
              <TypewriterText text={analysisDetails?.competitors} speed={2} disableAnimation={!isNew} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;
