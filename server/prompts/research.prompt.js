const researchPromptTemplate = `You are a senior investment analyst. Generate an institutional-grade investment research report for: {companyName}.

[Context]
Qualitative: {tavilyContext}
Quantitative: {financialContext}
Source: {dataSource}

Analyze: Overview, Business Model, Financials, Market Position, Competitors, News, Growth, Risks.

Score out of 20 (Total 100): Financial Health, Market Moat, Growth, Risk Profile, Valuation.
Recommendation: 80-100 INVEST, 50-79 HOLD, 0-49 PASS.

CRITICAL: Return ONLY valid JSON matching this exact structure, no markdown wrapper:
{
  "companyName": "Exact name",
  "dataSource": "Source used",
  "tickerSymbol": "Ticker or null",
  "website": "URL",
  "industry": "Industry",
  "ceo": "CEO name",
  "headquarters": "City, State, Country",
  "marketCap": "$1.54T",
  "totalRevenue": "$97.88B",
  "netIncome": "$3.86B",
  "peRatio": "372.25",
  "revenueGrowth": "+15.80%",
  "overview": "Overview...",
  "businessModel": "Business model...",
  "financials": "Financials...",
  "marketPosition": "Market share...",
  "competitors": "Competitors...",
  "latestNews": "Recent news...",
  "growthOps": "Growth catalysts...",
  "risks": "Weaknesses/threats...",
  "investmentScore": 85,
  "recommendation": "INVEST",
  "reasoning": "Detailed justification breakdown..."
}`;

module.exports = { researchPromptTemplate };
