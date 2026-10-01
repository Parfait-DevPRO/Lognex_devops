import { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import LogTable from '../components/LogTable';
import Pagination from '../components/Pagination';
import LogDetailModal from '../components/LogDetailModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import { useLogs } from '../hooks/useLogs';
import { Database } from 'lucide-react';

export default function LogExplorer() {
  const { logs, total, loading, error, searchLogs, fetchLogs } = useLogs();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const pageSize = 50;
  
  useEffect(() => {
    fetchLogs(currentPage, pageSize);
  }, [fetchLogs, currentPage]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    setCurrentPage(0);
    // Only search if there are actually filters active
    const hasFilters = Object.values(filters).some(val => val !== '');
    if (hasFilters) {
      searchLogs({ ...filters, page: 0, size: pageSize });
    } else {
      fetchLogs(0, pageSize);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const hasFilters = Object.values(currentFilters).some(val => val !== '');
    if (hasFilters) {
      searchLogs({ ...currentFilters, page: newPage, size: pageSize });
    } else {
      fetchLogs(newPage, pageSize);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
          <Database className="text-accent-blue" />
          Log Explorer
        </h2>
        <div className="text-sm text-gray-400 bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
          Total Results: <span className="text-gray-100 font-bold">{total.toLocaleString()}</span>
        </div>
      </div>

      <FilterBar onFilterChange={handleFilterChange} />

      <div className="bg-dark-800 rounded-xl border border-dark-700 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
        {loading && logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner text="Searching logs..." />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <ErrorState message={error} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-1">
              <LogTable logs={logs} onRowClick={setSelectedLog} />
            </div>
            {total > 0 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </>
        )}
      </div>

      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
