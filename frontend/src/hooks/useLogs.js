import { useState, useCallback } from 'react';
import { fetchLogs as apiFetchLogs, searchLogs as apiSearchLogs, fetchRecentLogs as apiFetchRecentLogs } from '../services/api';

export function useLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (page = 0, size = 50) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchLogs(page, size);
      setLogs(data.content || data);
      setTotal(data.totalElements || data.length || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchLogs = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiSearchLogs(filters);
      setLogs(data.content || data);
      setTotal(data.totalElements || data.length || 0);
    } catch (err) {
      setError(err.message || 'Failed to search logs');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentLogs = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchRecentLogs(limit);
      setLogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch recent logs');
    } finally {
      setLoading(false);
    }
  }, []);

  return { logs, total, loading, error, fetchLogs, searchLogs, fetchRecentLogs };
}
