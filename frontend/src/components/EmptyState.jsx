export default function EmptyState({ icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-dark-800/30 rounded-xl border border-dark-700 border-dashed">
      <div className="p-3 bg-dark-700 rounded-full mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm">{message}</p>
    </div>
  );
}
