const { getGeminiModel } = require('./gemini.service');
const { researchPrompt } = require('../../prompts/research.prompt');
const { StringOutputParser } = require('@langchain/core/output_parsers');

class ResearchService {
  /**
   * Generates a research report for a given company.
   * @param {string} companyName
   * @returns {Promise<Object>} JSON structured research report
   */
  static async generateReport(companyName) {
    try {
      const model = getGeminiModel();
      const outputParser = new StringOutputParser();

      // Create a LangChain sequence (Prompt -> Model -> OutputParser)
      const chain = researchPrompt.pipe(model).pipe(outputParser);

      // Execute the chain
      const response = await chain.invoke({
        companyName: companyName,
      });

      // Clean up the response in case Gemini returns markdown JSON wrappers
      let cleanedResponse = response.trim();
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
