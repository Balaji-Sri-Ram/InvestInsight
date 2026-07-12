const { getGeminiModel } = require('./gemini.service');
const { researchPromptTemplate } = require('../../prompts/research.prompt');
const FinancialDataService = require('./financialData.service');

const withTimeout = (promise, ms, name) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${name} timed out after ${ms}ms`)), ms))
  ]);
};

class ResearchService {
  /**
   * Generates a research report for a given company.
   * @param {string} companyName
   * @param {function} onProgress
   * @returns {Promise<Object>} JSON structured research report
   */
  static async generateReport(companyName, onProgress = () => {}) {
    try {
      onProgress('Gathering financial and qualitative data...');
      
      // Parallelize independent operations
      const [financialData, tavilyRes] = await Promise.all([
        FinancialDataService.fetchCompanyContext(companyName),
        (async () => {
          let tavilyContext = "No qualitative context available.";
          try {
            const { tavily } = require("@tavily/core");
            const apiKey = process.env.TAVILY_API_KEY;
            if (apiKey) {
              const tvly = tavily({ apiKey });
              const res = await withTimeout(tvly.search(`Company overview, business model, products, competitors, latest news, risks, and growth opportunities of ${companyName}.`, {
                searchDepth: "basic",
                includeAnswer: true,
                maxResults: 3
              }), 8000, 'Tavily Qualitative Search');
              tavilyContext = res.answer || res.results.map(r => r.content).join(" ");
            }
          } catch (err) {
            console.warn("Tavily qualitative search failed, continuing without it.", err.message);
          }
          return tavilyContext;
        })()
      ]);

      const { financialContext, dataSource } = financialData;
      const tavilyContext = tavilyRes;

      onProgress('AI analyzing data...');
      const model = getGeminiModel();
      
      const prompt = researchPromptTemplate
        .replace('{companyName}', companyName)
        .replace('{tavilyContext}', tavilyContext)
        .replace('{financialContext}', financialContext)
        .replace('{dataSource}', dataSource);

      const response = await model.invoke(prompt);
      let content = response.content || response;
      if (typeof content !== 'string') content = JSON.stringify(content);

      onProgress('Generating report...');
      
      // Clean up the response in case Gemini returns markdown JSON wrappers
      let cleanedResponse = content.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```/, '').replace(/```$/, '').trim();
      }

      // Parse and return the JSON
      const parsedData = JSON.parse(cleanedResponse);
      return parsedData;

    } catch (error) {
      console.error('Error generating AI research report:', error);
      throw new Error('Failed to generate investment report. ' + error.message);
    }
  }
}

module.exports = ResearchService;
