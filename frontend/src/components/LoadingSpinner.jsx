import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
      <Loader2 className="w-8 h-8 animate-spin mb-3 text-accent-blue" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
