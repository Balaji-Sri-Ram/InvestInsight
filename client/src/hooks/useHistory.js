import { useState, useEffect } from 'react';
import { ResearchAPI } from '../services/api';

export const useHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ResearchAPI.getAllReports();
        if (response.success && isMounted) {
          setReports(response.data);
        } else if (isMounted) {
          throw new Error(response.message || 'Failed to fetch history');
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

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, error, reports };
};
