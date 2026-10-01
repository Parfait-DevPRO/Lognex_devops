export default function StatusBadge({ status, type = 'level' }) {
  const s = String(status).toUpperCase();
  
  let styles = 'bg-gray-500/20 text-gray-400';
  
  if (type === 'level') {
    switch(s) {
      case 'INFO': styles = 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'; break;
      case 'WARNING':
      case 'WARN': styles = 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30'; break;
      case 'ERROR': styles = 'bg-accent-red/20 text-accent-red border border-accent-red/30'; break;
      case 'SECURITY': styles = 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'; break;
      case 'DEBUG': styles = 'bg-gray-500/20 text-gray-400 border border-gray-600'; break;
      default: break;
    }
  } else if (type === 'severity') {
    switch(s) {
      case 'CRITICAL': styles = 'bg-accent-red/20 text-accent-red border border-accent-red/30'; break;
      case 'HIGH': styles = 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30'; break;
      case 'MEDIUM': styles = 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'; break;
      case 'LOW': styles = 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'; break;
      default: break;
    }
  }

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${styles}`}>
      {s}
    </span>
  );
}
