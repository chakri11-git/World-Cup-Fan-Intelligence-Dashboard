import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom hook to handle live match data fetching and auto-polling
 */
export const useLiveScores = (pollInterval = 10000) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to update live scores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMatches();

    // Setup polling interval for live scoreboard feeds
    const intervalId = setInterval(fetchMatches, pollInterval);

    return () => clearInterval(intervalId);
  }, [pollInterval]);

  return { matches, loading, error, refetch: fetchMatches };
};
