import { useEffect, useState, useRef } from 'react';
import { Play, Pause, Trash2, Search } from 'lucide-react';
import { fetchRecentLogs } from '../services/api';

export default function LiveLogs() {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState({ text: '', level: 'ALL' });
  const logsEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let interval;
    const loadLogs = async () => {
      if (!isPaused) {
        try {
          const data = await fetchRecentLogs(50);
          // Prepend new logs and keep max 200
          setLogs(prev => {
            const newLogs = data.filter(d => !prev.some(p => p.id === d.id));
            const combined = [...prev, ...newLogs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            return combined.slice(-200);
          });
        } catch (error) {
          console.error("Failed to fetch live logs", error);
        }
      }
    };

    loadLogs();
    interval = setInterval(loadLogs, 2000);
    
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isBottom);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter.level !== 'ALL' && log.level !== filter.level) return false;
    if (filter.text && !log.message.toLowerCase().includes(filter.text.toLowerCase()) && 
        !log.server.toLowerCase().includes(filter.text.toLowerCase())) return false;
    return true;
  });

  const getLogColor = (level) => {
    switch (level) {
      case 'INFO': return 'text-accent-blue';
      case 'WARNING':
      case 'WARN': return 'text-accent-orange';
      case 'ERROR': return 'text-accent-red';
      case 'SECURITY': return 'text-accent-blue';
      case 'DEBUG': return 'text-gray-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-dark-800 p-4 rounded-xl border border-dark-700">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPaused ? 'bg-accent-blue hover:bg-accent-blue/90 text-white' : 'bg-dark-700 hover:bg-dark-600 text-gray-200'
            }`}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button 
            onClick={() => setLogs([])}
            className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-200 rounded-lg transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Clear
          </button>
          
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer ml-4">
            <input 
              type="checkbox" 
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-dark-600 bg-dark-900 text-accent-blue focus:ring-accent-blue"
            />
            Auto-scroll
          </label>
        </div>
        
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter text..." 
              value={filter.text}
              onChange={(e) => setFilter({...filter, text: e.target.value})}
              className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-accent-blue"
            />
          </div>
          <select 
            value={filter.level}
            onChange={(e) => setFilter({...filter, level: e.target.value})}
            className="bg-dark-900 border border-dark-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-accent-blue"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="SECURITY">SECURITY</option>
          </select>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 bg-[#0a0a0a] border border-dark-700 rounded-xl overflow-y-auto p-4 font-mono text-sm shadow-inner"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">No logs to display...</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="py-1 hover:bg-dark-800/50 flex gap-4 break-words">
              <span className="text-gray-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className={`w-20 shrink-0 font-bold ${getLogColor(log.level)}`}>{log.level}</span>
              <span className="text-accent-blue shrink-0 w-24 truncate" title={log.server}>{log.server}</span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
