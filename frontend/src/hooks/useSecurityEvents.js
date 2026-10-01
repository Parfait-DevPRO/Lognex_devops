import { useState, useCallback } from 'react';
import { fetchSecurityEvents as apiFetchSecurityEvents, fetchSecurityStats as apiFetchSecurityStats } from '../services/api';

export function useSecurityEvents() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (page = 0, size = 50) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchSecurityEvents(page, size);
      setEvents(data.content || data || []);
      setTotal(data.totalElements || data.length || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch security events');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchSecurityStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch security stats');
    } finally {
      setLoading(false);
    }
  }, []);

  return { events, stats, total, loading, error, fetchEvents, fetchStats };
}
