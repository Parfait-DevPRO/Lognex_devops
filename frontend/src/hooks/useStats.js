import { useState, useCallback } from 'react';
import { fetchStatsOverview, fetchTimeline, fetchLevelDistribution, fetchServerStats, fetchSourceStats } from '../services/api';

export function useStats() {
  const [stats, setStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [levels, setLevels] = useState([]);
  const [servers, setServers] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Execute all in parallel, but handle failures gracefully by falling back to empty/null if an endpoint 404s
      const safeFetch = async (fn, fallback) => {
        try { return await fn(); } catch (e) { return fallback; }
      };
      
      const [oData, tData, lData, svData, srData] = await Promise.all([
        safeFetch(fetchStatsOverview, { totalLogs: 0, errors: 0, securityEvents: 0, activeServers: 0 }),
        safeFetch(() => fetchTimeline('hour'), []),
        safeFetch(fetchLevelDistribution, []),
        safeFetch(fetchServerStats, []),
        safeFetch(fetchSourceStats, [])
      ]);
      
      setStats(oData);
      setTimeline(Array.isArray(tData) ? tData : []);
      setLevels(Array.isArray(lData) ? lData : []);
      setServers(Array.isArray(svData) ? svData : []);
      setSources(Array.isArray(srData) ? srData : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, timeline, levels, servers, sources, loading, error, fetchAllStats };
}
