import { useEffect, useState } from 'react';
import { Shield, ShieldAlert, AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import StatusBadge from '../components/StatusBadge';
import LogDetailModal from '../components/LogDetailModal';
import Pagination from '../components/Pagination';
import { useSecurityEvents } from '../hooks/useSecurityEvents';

export default function Security() {
  const { events, stats, total, loading, error, fetchEvents, fetchStats } = useSecurityEvents();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const pageSize = 20;

  useEffect(() => {
    fetchStats();
    fetchEvents(currentPage, pageSize);
  }, [fetchStats, fetchEvents, currentPage]);

  if (loading && !events.length && !stats) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => { fetchStats(); fetchEvents(0, pageSize); }} />;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-accent-blue w-8 h-8" />
        <h2 className="text-2xl font-bold text-gray-100">Security Center</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Critical Alerts" 
          value={stats?.critical || 0} 
          icon={<AlertOctagon size={24} />} 
          type="red" 
        />
        <KpiCard 
          title="High Alerts" 
          value={stats?.high || 0} 
          icon={<ShieldAlert size={24} />} 
          type="orange" 
        />
        <KpiCard 
          title="Medium Alerts" 
          value={stats?.medium || 0} 
          icon={<AlertTriangle size={24} />} 
          type="cyan" 
        />
        <KpiCard 
          title="Low Alerts" 
          value={stats?.low || 0} 
          icon={<Info size={24} />} 
          type="blue" 
        />
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-dark-700 bg-dark-800/80">
          <h3 className="text-lg font-medium text-gray-200">Recent Security Events</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-dark-700">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Source IP</th>
                <th className="px-4 py-3">Server</th>
                <th className="px-4 py-3">Event Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700 font-mono">
              {events.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No security events found.</td></tr>
              ) : (
                events.map((event) => (
                  <tr 
                    key={event.id} 
                    className="hover:bg-dark-600/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedLog(event)}
                  >
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={event.severity || 'MEDIUM'} type="severity" />
                    </td>
                    <td className="px-4 py-3 text-gray-300">{event.ipAddress || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{event.server}</td>
                    <td className="px-4 py-3 text-gray-300 truncate max-w-md">{event.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {total > 0 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>
      
      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
