import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useReport } from '../hooks/useReport';
import { ReportSkeleton } from '../components/ui/Skeleton';
import { TypewriterText } from '../components/ui/TypewriterText';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Briefcase, Activity, Target, Globe, ExternalLink, Building, User, MapPin, Scale, DollarSign, Heart, BarChart2 } from 'lucide-react';
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
      
      // Clean company name for better search results (remove , Inc. Corporation, LLC, etc)
      const cleanName = report.companyName.replace(/,\s*(inc|llc|ltd|corp)\.?$/i, '').replace(/\s+(inc|llc|ltd|corp|corporation)\.?$/i, '').trim();

      fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(cleanName)}`)
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
      case 'PASS': return 'bg-red-100 text-red-800 border-red-200';
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
          <h1 className="text-4xl font-bold tracking-tight">
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
              <span className="text-sm text-[var(--color-secondary)] font-medium">/100</span>
            </div>
          </div>

          <div className="h-12 w-px bg-[var(--color-border)]"></div>

          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-[var(--color-secondary)] uppercase tracking-wider mb-2">
              Action
            </span>
            <span className={cn("px-4 py-1.5 text-sm rounded-full font-bold tracking-wide border", getRecommendationColor(recommendation))}>
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
              <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
              Company Overview
            </h2>
            <div className="prose prose-slate max-w-none text-[var(--color-secondary)] leading-relaxed">
              <p><TypewriterText text={analysisDetails?.overview} speed={2} disableAnimation={!isNew} /></p>
            </div>
          </section>

          {/* Quick Info Cards */}
          {(analysisDetails?.industry || analysisDetails?.ceo || analysisDetails?.headquarters) && (
            <div className="flex flex-wrap gap-4 pt-2">
              {analysisDetails?.industry && (
                <div className="flex-1 min-w-[200px] p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-[var(--color-secondary)]" />
                    <span className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wider">Industry</span>
                  </div>
                  <div className="text-[var(--color-heading)] font-semibold text-sm">
                    {analysisDetails.industry}
                  </div>
                </div>
              )}
              
              {analysisDetails?.ceo && (
                <div className="flex-1 min-w-[200px] p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[var(--color-secondary)]" />
                    <span className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wider">CEO</span>
                  </div>
                  <div className="text-[var(--color-heading)] font-semibold text-sm">
                    {analysisDetails.ceo}
                  </div>
                </div>
              )}

              {analysisDetails?.headquarters && (
                <div className="flex-1 min-w-[200px] p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[var(--color-secondary)]" />
                    <span className="text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wider">Headquarters</span>
                  </div>
                  <div className="text-[var(--color-heading)] font-semibold text-sm">
                    {analysisDetails.headquarters}
                  </div>
                </div>
              )}
            </div>
          )}

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--color-primary)]" />
              Business Model
            </h2>
            <div className="prose prose-slate max-w-none text-[var(--color-secondary)] leading-relaxed">
              <p><TypewriterText text={analysisDetails?.businessModel} speed={2} disableAnimation={!isNew} /></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--color-primary)]" />
              Financial Health & Valuation
            </h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-[var(--color-secondary)] leading-relaxed whitespace-pre-wrap">
                  <TypewriterText text={analysisDetails?.financials} speed={2} disableAnimation={!isNew} />
                </p>
                
                {/* 5 Financial Metric Boxes */}
                {(analysisDetails?.marketCap || analysisDetails?.totalRevenue || analysisDetails?.netIncome || analysisDetails?.peRatio || analysisDetails?.revenueGrowth) && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-[var(--color-border)]">
                    
                    {analysisDetails?.marketCap && (
                      <div className="flex flex-col p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-wider leading-tight">Market<br/>Cap</span>
                          <div className="p-1 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            <Scale className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="text-[var(--color-heading)] font-bold text-lg mt-auto leading-none mb-1">{analysisDetails.marketCap}</div>
                        <div className="text-[10px] text-[var(--color-secondary)] leading-tight">Total market value</div>
                      </div>
                    )}
                    
                    {analysisDetails?.totalRevenue && (
                      <div className="flex flex-col p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-wider leading-tight">Total<br/>Revenue</span>
                          <div className="p-1 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            <DollarSign className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="text-[var(--color-heading)] font-bold text-lg mt-auto leading-none mb-1">{analysisDetails.totalRevenue}</div>
                        <div className="text-[10px] text-[var(--color-secondary)] leading-tight">Gross top-line (TTM)</div>
                      </div>
                    )}

                    {analysisDetails?.netIncome && (
                      <div className="flex flex-col p-3 rounded-xl border border-[var(--color-border)] bg-emerald-500/5 shadow-sm border-emerald-500/20">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider leading-tight">Net<br/>Income</span>
                          <div className="p-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                            <Heart className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-bold text-lg mt-auto leading-none mb-1">{analysisDetails.netIncome}</div>
                        <div className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70 leading-tight">Net bottom-line profits</div>
                      </div>
                    )}

                    {analysisDetails?.peRatio && (
                      <div className="flex flex-col p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-wider leading-tight">P/E<br/>Ratio</span>
                          <div className="p-1 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            <BarChart2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="text-[var(--color-heading)] font-bold text-lg mt-auto leading-none mb-1">{analysisDetails.peRatio}</div>
                        <div className="text-[10px] text-[var(--color-secondary)] leading-tight">Earnings multiple</div>
                      </div>
                    )}

                    {analysisDetails?.revenueGrowth && (
                      <div className="flex flex-col p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-[var(--color-secondary)] uppercase tracking-wider leading-tight">Revenue<br/>Growth</span>
                          <div className="p-1 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                            <TrendingUp className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mt-auto leading-none mb-1">{analysisDetails.revenueGrowth}</div>
                        <div className="text-[10px] text-[var(--color-secondary)] leading-tight">Year-over-year change</div>
                      </div>
                    )}

                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
              Final Reasoning
            </h2>
            <div className="p-6 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 text-[var(--color-heading)] leading-relaxed font-medium">
              <TypewriterText text={analysisDetails?.reasoning} speed={2} disableAnimation={!isNew} />
            </div>
          </section>
          
        </div>

        {/* Right Column - SWOT & Market */}
        <div className="space-y-6">
          {(() => {
            const leftCharCount = (analysisDetails?.overview?.length || 0) + (analysisDetails?.businessModel?.length || 0) + (analysisDetails?.financials?.length || 0) + (analysisDetails?.reasoning?.length || 0);
            const isMatterLess = leftCharCount < 1800;

            return (
              <>
                <Card key="news">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[var(--color-primary)]" />
                      Latest News & Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--color-secondary)] leading-relaxed text-sm">
                      <TypewriterText text={analysisDetails?.latestNews} speed={2} disableAnimation={!isNew} />
                    </p>
                  </CardContent>
                </Card>

                <Card key="growth">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-600">
                      <TrendingUp className="w-5 h-5" />
                      Growth Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-slate max-w-none text-[var(--color-secondary)] leading-relaxed prose-li:my-0.5">
                      <TypewriterText text={analysisDetails?.growthOps} speed={2} disableAnimation={!isNew} />
                    </div>
                  </CardContent>
                </Card>

                <Card key="risks">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-500">
                      <AlertTriangle className="w-5 h-5" />
                      Risks & Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-slate max-w-none text-[var(--color-secondary)] leading-relaxed prose-li:my-0.5">
                      <TypewriterText text={analysisDetails?.risks} speed={2} disableAnimation={!isNew} />
                    </div>
                  </CardContent>
                </Card>

                {isMatterLess && (
                  <>
                    <Card key="market">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-[var(--color-primary)]" />
                          Market Position
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[var(--color-secondary)] leading-relaxed text-sm">
                          <TypewriterText text={analysisDetails?.marketPosition} speed={2} disableAnimation={!isNew} />
                        </p>
                      </CardContent>
                    </Card>

                    <Card key="competitors">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-[var(--color-primary)]" />
                          Competitors
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[var(--color-secondary)] leading-relaxed text-sm">
                          <TypewriterText text={analysisDetails?.competitors} speed={2} disableAnimation={!isNew} />
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Bottom Section - Only shown if matter is MORE */}
      {(() => {
        const leftCharCount = (analysisDetails?.overview?.length || 0) + (analysisDetails?.businessModel?.length || 0) + (analysisDetails?.financials?.length || 0) + (analysisDetails?.reasoning?.length || 0);
        if (leftCharCount >= 1800) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[var(--color-primary)]" />
                    Market Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-secondary)] leading-relaxed">
                    <TypewriterText text={analysisDetails?.marketPosition} speed={2} disableAnimation={!isNew} />
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[var(--color-primary)]" />
                    Competitors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-secondary)] leading-relaxed whitespace-pre-wrap">
                    <TypewriterText text={analysisDetails?.competitors} speed={2} disableAnimation={!isNew} />
                  </p>
                </CardContent>
              </Card>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default Report;
