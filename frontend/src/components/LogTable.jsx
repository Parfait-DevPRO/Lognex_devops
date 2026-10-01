import StatusBadge from './StatusBadge';

export default function LogTable({ logs, onRowClick }) {
  if (!logs || logs.length === 0) {
    return <div className="text-gray-400 p-4 text-center">No logs found.</div>;
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-dark-700 bg-dark-800">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-400 uppercase bg-dark-700">
          <tr>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Level</th>
            <th className="px-4 py-3">Server</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-700 font-mono">
          {logs.map((log) => (
            <tr 
              key={log.id} 
              className="hover:bg-dark-600/50 cursor-pointer transition-colors"
              onClick={() => onRowClick && onRowClick(log)}
            >
              <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={log.level} type="level" />
              </td>
              <td className="px-4 py-3 text-gray-300">{log.server}</td>
              <td className="px-4 py-3 text-gray-300 truncate max-w-md" title={log.message}>
                {log.message}
              </td>
              <td className="px-4 py-3 text-gray-300">{log.status || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
