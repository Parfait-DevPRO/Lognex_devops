import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Activity, Database, Clock } from 'lucide-react';
import { useServers } from '../hooks/useServers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function Servers() {
  const { servers, loading, error, fetchServers } = useServers();
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  if (loading && servers.length === 0) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchServers} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <Server className="text-accent-blue" />
          Monitored Servers
        </h2>
        <div className="text-sm text-gray-400 bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
          Total: <span className="text-gray-100 font-bold">{servers.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {servers.map((server) => (
          <div 
            key={server.name}
            onClick={() => navigate(`/servers/${server.name}`)}
            className="bg-dark-800 rounded-xl border border-dark-700 p-5 hover:border-accent-blue/50 hover:bg-dark-700/50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-dark-900 rounded-lg group-hover:text-accent-blue transition-colors">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">{server.name}</h3>
                  <span className="text-xs text-gray-500 uppercase">{server.environment || 'Production'}</span>
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Activity size={14} /> IP Address</span>
                <span className="text-gray-300 font-mono">{server.ipAddress || '192.168.1.100'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Database size={14} /> Log Count</span>
                <span className="text-gray-300 font-mono">{server.logCount?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Clock size={14} /> Last Active</span>
                <span className="text-gray-300">{server.lastActive ? new Date(server.lastActive).toLocaleTimeString() : 'Just now'}</span>
              </div>
            </div>
          </div>
        ))}
        {servers.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No servers currently monitored.
          </div>
        )}
      </div>
    </div>
  );
}
