import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-dark-800/50 rounded-xl border border-accent-red/20 text-center">
      <AlertCircle className="w-10 h-10 text-accent-red mb-3" />
      <h3 className="text-lg font-medium text-gray-200 mb-2">Something went wrong</h3>
      <p className="text-gray-400 text-sm max-w-md mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-200 rounded-lg transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
}
