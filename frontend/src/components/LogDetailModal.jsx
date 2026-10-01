import { X } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function LogDetailModal({ log, onClose }) {
  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-900">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-3">
            Log Details
            <StatusBadge status={log.level} type="level" />
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto font-mono text-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 block mb-1">Timestamp</span>
              <span className="text-gray-200">{new Date(log.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Server</span>
              <span className="text-gray-200">{log.server}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Source</span>
              <span className="text-gray-200">{log.source || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Status Code</span>
              <span className="text-gray-200">{log.status || 'N/A'}</span>
            </div>
            {log.ipAddress && (
              <div>
                <span className="text-gray-500 block mb-1">IP Address</span>
                <span className="text-gray-200">{log.ipAddress}</span>
              </div>
            )}
            {log.endpoint && (
              <div>
                <span className="text-gray-500 block mb-1">Endpoint</span>
                <span className="text-gray-200">{log.endpoint}</span>
              </div>
            )}
          </div>
          
          <div>
            <span className="text-gray-500 block mb-2">Message</span>
            <div className="bg-dark-900 p-4 rounded border border-dark-700 text-gray-300 break-words whitespace-pre-wrap">
              {log.message}
            </div>
          </div>
          
          {log.stackTrace && (
            <div>
              <span className="text-gray-500 block mb-2">Stack Trace</span>
              <div className="bg-dark-900 p-4 rounded border border-dark-700 text-accent-red break-words whitespace-pre-wrap overflow-x-auto text-xs">
                {log.stackTrace}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
