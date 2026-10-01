import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Server, ArrowLeft, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useServers } from '../hooks/useServers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import KpiCard from '../components/KpiCard';
import LogTable from '../components/LogTable';

export default function ServerDetail() {
  const { serverName } = useParams();
  const navigate = useNavigate();
  const { serverDetail, loading, error, fetchServerDetails } = useServers();

  useEffect(() => {
    fetchServerDetails(serverName);
  }, [fetchServerDetails, serverName]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => fetchServerDetails(serverName)} />;
  if (!serverDetail) return <ErrorState message="Server not found" />;

  const mockStats = {
    totalLogs: 15420,
    errors: 142,
    security: 5,
    cpu: '34%',
    memory: '68%'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/servers')}
          className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors border border-dark-700"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
            {serverName}
            <span className="w-3 h-3 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          </h2>
          <span className="text-gray-500 text-sm">IP: {serverDetail.ipAddress || '192.168.1.100'} • ENV: {serverDetail.environment || 'Production'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Logs" value={mockStats.totalLogs.toLocaleString()} icon={<Activity size={24} />} type="blue" />
        <KpiCard title="Error Events" value={mockStats.errors} icon={<AlertTriangle size={24} />} type="red" />
        <KpiCard title="Security Events" value={mockStats.security} icon={<ShieldAlert size={24} />} type="purple" />
        <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm font-medium">System Resources</span>
            <Server size={20} className="text-accent-blue" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">CPU Usage</span>
              <span className="text-sm font-mono text-gray-300">{mockStats.cpu}</span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-1.5">
              <div className="bg-accent-blue h-1.5 rounded-full" style={{ width: mockStats.cpu }}></div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-500">Memory</span>
              <span className="text-sm font-mono text-gray-300">{mockStats.memory}</span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-1.5">
              <div className="bg-accent-blue h-1.5 rounded-full" style={{ width: mockStats.memory }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 p-5">
        <h3 className="text-lg font-medium text-gray-200 mb-4">Recent Server Logs</h3>
        {serverDetail.recentLogs ? (
          <LogTable logs={serverDetail.recentLogs} />
        ) : (
          <div className="text-center py-8 text-gray-500">Log data temporarily unavailable</div>
        )}
      </div>
    </div>
  );
}
