import { useState, useEffect } from 'react';
import { ResearchAPI } from '../services/api';

export const useReport = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReport = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await ResearchAPI.getReportById(id);
        if (response.success && isMounted) {
          setReport(response.data);
        } else if (isMounted) {
          throw new Error(response.message || 'Failed to fetch report');
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { loading, error, report };
};
