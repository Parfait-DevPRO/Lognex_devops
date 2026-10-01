import { useState, useCallback } from 'react';
import { fetchServers as apiFetchServers, fetchServerDetails as apiFetchServerDetails } from '../services/api';

export function useServers() {
  const [servers, setServers] = useState([]);
  const [serverDetail, setServerDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchServers();
      setServers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch servers');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchServerDetails = useCallback(async (serverName) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetchServerDetails(serverName);
      setServerDetail(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch server details');
    } finally {
      setLoading(false);
    }
  }, []);

  return { servers, serverDetail, loading, error, fetchServers, fetchServerDetails };
}
