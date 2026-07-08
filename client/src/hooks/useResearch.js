import { useState } from 'react';
import { ResearchAPI } from '../services/api';

export const useResearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const generateReport = async (companyName) => {
    try {
      setLoading(true);
      setError(null);
      setReport(null);
      
      const response = await ResearchAPI.generateReport(companyName);
      
      if (response.success) {
        setReport(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to generate report');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateReport,
    loading,
    error,
    report,
    resetError: () => setError(null)
  };
};
