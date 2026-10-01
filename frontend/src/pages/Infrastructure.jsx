import { Server, Database, GitBranch, Terminal, Shield, ArrowRight } from 'lucide-react';

export default function Infrastructure() {
  const nodes = [
    { name: 'Kubernetes', status: 'healthy', icon: <Server />, meta: '24 Nodes / 142 Pods' },
    { name: 'API Gateway', status: 'healthy', icon: <Terminal />, meta: '4 Replicas / 99.9% Uptime' },
    { name: 'Log Ingestion', status: 'healthy', icon: <GitBranch />, meta: 'Processing 4k events/s' },
    { name: 'ElasticSearch', status: 'healthy', icon: <Database />, meta: 'Cluster OK / 3.2TB' },
    { name: 'PostgreSQL', status: 'healthy', icon: <Database />, meta: 'Primary OK / 452GB' },
    { name: 'Security Scanners', status: 'healthy', icon: <Shield />, meta: 'Active / Updated' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Infrastructure Status</h2>
        <p className="text-gray-400">Real-time overview of the LOGNEX underlying architecture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map(node => (
          <div key={node.name} className="bg-dark-800 p-5 rounded-xl border border-dark-700 flex items-start gap-4">
            <div className="text-accent-cyan shrink-0">
              {node.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-200 mb-1">{node.name}</h3>
              <p className="text-sm text-gray-600 mb-3 font-mono">{node.meta}</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-sm font-medium text-accent-green capitalize">{node.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
        <h3 className="text-lg font-medium text-gray-200 mb-6">CI/CD Pipeline Flow</h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-8 px-4 overflow-x-auto">
          {[
            { n: 'GitHub', logo: 'https://cdn.simpleicons.org/github/181717' },
            { n: 'Jenkins', logo: 'https://cdn.simpleicons.org/jenkins/D24939' },
            { n: 'Maven', logo: 'https://cdn.simpleicons.org/apachemaven/C71A36' },
            { n: 'npm', logo: 'https://cdn.simpleicons.org/npm/CB3837' },
            { n: 'Docker', logo: 'https://cdn.simpleicons.org/docker/2496ED' },
            { n: 'Docker Hub', logo: 'https://cdn.simpleicons.org/docker/2496ED' },
            { n: 'Kubernetes', logo: 'https://cdn.simpleicons.org/kubernetes/326CE5' }
          ].map((step, i, arr) => (
            <div key={step.n} className="flex items-center shrink-0">
              <div className="flex min-w-[88px] flex-col items-center justify-center px-2 text-center" title={step.n}>
                <img
                  src={step.logo}
                  alt={`${step.n} logo`}
                  className={`w-10 h-10 object-contain ${step.n === 'GitHub' ? 'pipeline-github-logo' : ''}`}
                  loading="lazy"
                />
                <span className="mt-2 text-xs font-medium text-gray-600">{step.n}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="text-gray-600 mx-3 hidden md:block">
                  <ArrowRight size={24} />
                </div>
              )}
              {i < arr.length - 1 && (
                <div className="text-gray-600 my-2 md:hidden">
                  <ArrowRight size={24} className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
