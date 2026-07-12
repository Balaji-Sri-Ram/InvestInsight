import axios from 'axios';

// Create an Axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Service to handle research-related API calls
 */
export const ResearchAPI = {
  /**
   * Triggers the AI to generate a research report
   * @param {string} companyName 
   * @param {function} onProgress 
   * @returns {Promise<Object>}
   */
  generateReport: async (companyName, onProgress) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${baseURL}/research/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyName }),
    });

    if (!response.body) throw new Error('ReadableStream not yet supported in this browser.');
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let resultData = null;
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop(); // Keep the last incomplete part in the buffer

      for (const part of parts) {
        if (part.startsWith('data: ')) {
          try {
            const dataStr = part.substring(6);
            const parsed = JSON.parse(dataStr);
            if (parsed.progress && onProgress) {
              onProgress(parsed.progress);
            }
            if (parsed.success !== undefined) {
              resultData = parsed;
            }
          } catch (e) {
            console.error('Error parsing stream chunk:', e);
          }
        }
      }
    }
    
    if (resultData && !resultData.success) {
      throw new Error(resultData.message || 'Failed to generate report');
    }
    
    return resultData || { success: false, message: 'No result received' };
  },
  
  /**
   * Fetches a specific research report by ID
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  getReportById: async (id) => {
    const response = await apiClient.get(`/research/${id}`);
    return response.data;
  },

  /**
   * Fetches all research reports history
   * @returns {Promise<Array>}
   */
  getAllReports: async () => {
    const response = await apiClient.get('/research');
    return response.data;
  }
};

export default apiClient;
