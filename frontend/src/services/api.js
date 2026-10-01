import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8085' : '')
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const fetchLogs = (page = 0, size = 50) => api.get('/api/logs', { params: { page, size } });
export const fetchLogById = (id) => api.get(`/api/logs/${id}`);
export const createLog = (data) => api.post('/api/logs', data);
export const deleteLog = (id) => api.delete(`/api/logs/${id}`);
export const searchLogs = (filters) => api.get('/api/logs/search', { params: filters });
export const fetchRecentLogs = (limit = 10) => api.get('/api/logs/recent', { params: { limit } });

export const fetchStatsOverview = () => api.get('/api/stats/overview');
export const fetchTimeline = (interval = 'hour') => api.get('/api/stats/timeline', { params: { interval } });
export const fetchLevelDistribution = () => api.get('/api/stats/levels');
export const fetchServerStats = () => api.get('/api/stats/servers');
export const fetchSourceStats = () => api.get('/api/stats/sources');

export const fetchSecurityEvents = (page = 0, size = 50) => api.get('/api/security/events', { params: { page, size } });
export const fetchSecurityStats = () => api.get('/api/security/stats');

export const fetchServers = () => api.get('/api/servers');
export const fetchServerDetails = (serverName) => api.get(`/api/servers/${serverName}`);

export const fetchHealth = () => api.get('/api/health');

export default api;
