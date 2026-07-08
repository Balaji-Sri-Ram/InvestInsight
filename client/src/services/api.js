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
   * @returns {Promise<Object>}
   */
  generateReport: async (companyName) => {
    const response = await apiClient.post('/research/generate', { companyName });
    return response.data; // { success: true, data: { ... } }
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
