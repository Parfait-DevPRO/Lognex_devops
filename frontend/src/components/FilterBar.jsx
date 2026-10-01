import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

export default function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState({
    message: '',
    level: '',
    server: '',
    source: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const levels = ['INFO', 'WARNING', 'ERROR', 'DEBUG', 'SECURITY'];
  
  return (
    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-wrap gap-4 items-center mb-6">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          name="message"
          value={filters.message}
          onChange={handleChange}
          placeholder="Search log message..." 
          className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-dark-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-500" />
        <select 
          name="level" 
          value={filters.level} 
          onChange={handleChange}
          className="bg-dark-900 border border-dark-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-accent-blue"
        >
          <option value="">All Levels</option>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <input 
        type="text" 
        name="server"
        value={filters.server}
        onChange={handleChange}
        placeholder="Server name" 
        className="bg-dark-900 border border-dark-600 rounded-lg text-sm text-gray-200 px-3 py-2 w-32 focus:outline-none focus:border-accent-blue"
      />

      <div className="flex items-center gap-2">
        <input 
          type="datetime-local" 
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="bg-dark-900 border border-dark-600 rounded-lg text-sm text-gray-400 px-3 py-2 focus:outline-none focus:border-accent-blue"
        />
        <span className="text-gray-500">to</span>
        <input 
          type="datetime-local" 
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className="bg-dark-900 border border-dark-600 rounded-lg text-sm text-gray-400 px-3 py-2 focus:outline-none focus:border-accent-blue"
        />
      </div>
    </div>
  );
}
