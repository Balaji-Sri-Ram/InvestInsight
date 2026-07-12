const yahooFinance = require('yahoo-finance2').default;

const withTimeout = (promise, ms, name) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${name} timed out after ${ms}ms`)), ms))
  ]);
};

class FinancialDataService {
  /**
   * Fetches financial and company data with fallback logic:
   * Yahoo Finance -> Tavily -> Gemini
   * @param {string} companyName 
   * @returns {Promise<{ financialContext: string, dataSource: string }>}
   */
  static async fetchCompanyContext(companyName) {
    // 1. Try Yahoo Finance (Primary for Public Companies)
    try {
      const searchRes = await withTimeout(yahooFinance.search(companyName), 8000, 'Yahoo Finance Search');
      if (searchRes.quotes && searchRes.quotes.length > 0) {
        const bestMatch = searchRes.quotes.find(q => q.quoteType === 'EQUITY');
        
        if (bestMatch && bestMatch.symbol) {
          const symbol = bestMatch.symbol;
          const quoteSummary = await withTimeout(yahooFinance.quoteSummary(symbol, { 
            modules: ['summaryProfile', 'summaryDetail', 'financialData', 'price'] 
          }), 8000, 'Yahoo Finance QuoteSummary');

          const sp = quoteSummary.summaryProfile || {};
          const sd = quoteSummary.summaryDetail || {};
          const fd = quoteSummary.financialData || {};
          const price = quoteSummary.price || {};

          // Extract CEO
          let ceo = 'N/A';
          if (sp.companyOfficers && sp.companyOfficers.length > 0) {
            const ceoObj = sp.companyOfficers.find(o => o.title && o.title.toLowerCase().includes('ceo'));
            if (ceoObj) ceo = ceoObj.name;
            else ceo = sp.companyOfficers[0].name;
          }

          // Extract Headquarters
          const hq = [sp.city, sp.state, sp.country].filter(Boolean).join(', ') || 'N/A';

          const context = `Ticker: ${symbol}
Company Profile: ${sp.longBusinessSummary || 'N/A'}
Industry: ${sp.industry || 'N/A'}
Sector: ${sp.sector || 'N/A'}
Market Cap: ${sd.marketCap || 'N/A'}
Total Revenue: ${fd.totalRevenue || 'N/A'}
Net Income: ${fd.netIncomeToCommon || 'N/A'}
P/E Ratio: ${sd.trailingPE || 'N/A'}
Dividend Yield: ${sd.dividendYield ? (sd.dividendYield * 100).toFixed(2) + '%' : 'N/A'}
Employee Count: ${sp.fullTimeEmployees || 'N/A'}
Headquarters: ${hq}
CEO: ${ceo}
Current Stock Price: ${price.regularMarketPrice || 'N/A'}
Currency: ${price.currency || 'N/A'}
Exchange: ${price.exchangeName || 'N/A'}`;

          return {
            financialContext: context,
            dataSource: 'Yahoo Finance'
          };
        }
      }
    } catch (err) {
      console.warn(`Yahoo Finance fetch failed or company not found for ${companyName}:`, err.message);
    }

    // 2. Try Tavily (Fallback for Private Companies / Errors)
    try {
      const { tavily } = require("@tavily/core");
      const apiKey = process.env.TAVILY_API_KEY;
      if (apiKey) {
        const tvly = tavily({ apiKey });
        const query = `What are the financial statistics, total revenue, net income, market cap, CEO, headquarters, industry, sector, dividend yield, PE ratio, and stock price (if applicable) for ${companyName}?`;
        
        // Optimize: Limit results and apply timeout
        const tvlyRes = await withTimeout(tvly.search(query, {
          searchDepth: "basic",
          includeAnswer: true,
          maxResults: 3
        }), 8000, 'Tavily Search');

        const context = tvlyRes.answer || tvlyRes.results.map(r => r.content).join(" ");
        if (context && context.trim().length > 0) {
          return {
            financialContext: context,
            dataSource: 'Tavily'
          };
        }
      }
    } catch (err) {
      console.warn(`Tavily fallback search failed for ${companyName}:`, err.message);
    }

    // 3. Fallback to Gemini
    return {
      financialContext: 'No external public data could be retrieved. Rely entirely on your own internal knowledge to analyze this company.',
      dataSource: 'Gemini'
    };
  }
}

module.exports = FinancialDataService;
