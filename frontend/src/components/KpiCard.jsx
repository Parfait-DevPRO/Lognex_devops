export default function KpiCard({ title, value, icon, trend }) {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-5 flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className="dashboard-kpi-icon text-blue-600">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <span className="text-2xl font-bold text-gray-100">{value}</span>
      </div>
      {trend && (
        <div className="mt-2 text-xs font-medium flex items-center">
          <span className={trend.isPositive ? 'text-accent-green' : 'text-accent-red'}>
            {trend.value}
          </span>
          <span className="text-gray-500 ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
