import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Activity, AlertTriangle, ShieldAlert, Server } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import LogTable from '../components/LogTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { useStats } from '../hooks/useStats';
import { useLogs } from '../hooks/useLogs';
import LogDetailModal from '../components/LogDetailModal';

export default function Dashboard() {
  const { stats, timeline, levels, servers, loading: statsLoading, error: statsError, fetchAllStats } = useStats();
  const { logs, loading: logsLoading, fetchRecentLogs } = useLogs();
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchAllStats();
    fetchRecentLogs(10);
  }, [fetchAllStats, fetchRecentLogs]);

  if (statsLoading || logsLoading) return <LoadingSpinner />;
  if (statsError) return <ErrorState message={statsError} onRetry={fetchAllStats} />;

  const COLORS = {
    INFO: '#3b82f6',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    SECURITY: '#256eeb',
    DEBUG: '#6b7280'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Logs (24h)" 
          value={stats?.totalLogs?.toLocaleString() || 0} 
          icon={<Activity size={24} />} 
          type="blue" 
        />
        <KpiCard 
          title="Errors (24h)" 
          value={stats?.errors?.toLocaleString() || 0} 
          icon={<AlertTriangle size={24} />} 
          type="red" 
        />
        <KpiCard 
          title="Security Events" 
          value={stats?.securityEvents?.toLocaleString() || 0} 
          icon={<ShieldAlert size={24} />} 
          type="purple" 
        />
        <KpiCard 
          title="Active Servers" 
          value={stats?.activeServers || 0} 
          icon={<Server size={24} />} 
          type="green" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-dark-800 p-5 rounded-xl border border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Log Ingestion Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #dbe8f9)" vertical={false} />
                <XAxis dataKey="timestamp" stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--chart-surface, #fff)', borderColor: 'var(--chart-grid, #dbe8f9)', color: 'var(--chart-text, #1f2f46)' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Log Levels</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levels}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="level"
                >
                  {levels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.level] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--chart-surface)', borderColor: 'var(--chart-grid)', color: 'var(--chart-text)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {levels.map(l => (
              <div key={l.level} className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[l.level] || '#3b82f6' }}></span>
                <span className="text-gray-400">{l.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Events by Server</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servers} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #dbe8f9)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--chart-muted, #64748b)" fontSize={12} hide />
                <YAxis dataKey="server" type="category" stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{fill: 'var(--chart-grid, #dbe8f9)'}} contentStyle={{ backgroundColor: 'var(--chart-surface, #fff)', borderColor: 'var(--chart-grid, #dbe8f9)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 bg-dark-800 p-5 rounded-xl border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-200">Recent Logs</h3>
          </div>
          <LogTable logs={logs} onRowClick={setSelectedLog} />
        </div>
      </div>
      
      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
