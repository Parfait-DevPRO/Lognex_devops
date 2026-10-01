import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStats } from '../hooks/useStats';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';

export default function Analytics() {
  const { stats, timeline, servers, sources, loading, error, fetchAllStats } = useStats();
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats, timeRange]);

  if (loading && !timeline.length) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={fetchAllStats} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100">Analytics Dashboard</h2>
        <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-700">
          {['today', '7d', '30d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
                timeRange === range ? 'bg-dark-700 text-accent-blue font-medium' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {range === 'today' ? 'Today' : `Last ${range.replace('d', ' Days')}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{l: 'Total Events', v: stats?.totalLogs?.toLocaleString() || 0, c: 'text-accent-blue'},
          {l: 'Error Rate', v: '2.4%', c: 'text-accent-red'},
          {l: 'Security Rate', v: '0.1%', c: 'text-accent-blue'},
          {l: 'Avg Logs/Min', v: '342', c: 'text-accent-green'}
        ].map(k => (
          <div key={k.l} className="bg-dark-800 p-4 rounded-xl border border-dark-700 text-center">
            <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">{k.l}</span>
            <span className={`text-2xl font-bold ${k.c}`}>{k.v}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Event Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #dbe8f9)" vertical={false} />
                <XAxis dataKey="timestamp" stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--chart-surface, #fff)', borderColor: 'var(--chart-grid, #dbe8f9)', color: 'var(--chart-text, #1f2f46)' }} />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Error Rate Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #dbe8f9)" vertical={false} />
                <XAxis dataKey="timestamp" stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--chart-surface, #fff)', borderColor: 'var(--chart-grid, #dbe8f9)', color: 'var(--chart-text, #1f2f46)' }} />
                <Area type="monotone" dataKey="errors" stroke="#ef4444" fillOpacity={1} fill="url(#colorError)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Events by Source</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sources}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #dbe8f9)" vertical={false} />
                <XAxis dataKey="source" stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'var(--chart-grid, #dbe8f9)'}} contentStyle={{ backgroundColor: 'var(--chart-surface, #fff)', borderColor: 'var(--chart-grid, #dbe8f9)', color: 'var(--chart-text, #1f2f46)' }} />
                <Bar dataKey="count" fill="#256eeb" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-dark-800 p-5 rounded-xl border border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Top Servers</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servers} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid, #dbe8f9)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--chart-muted, #64748b)" fontSize={12} hide />
                <YAxis dataKey="server" type="category" stroke="var(--chart-muted, #64748b)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'var(--chart-grid, #dbe8f9)'}} contentStyle={{ backgroundColor: 'var(--chart-surface, #fff)', borderColor: 'var(--chart-grid, #dbe8f9)', color: 'var(--chart-text, #1f2f46)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
