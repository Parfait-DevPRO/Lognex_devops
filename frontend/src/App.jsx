import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import LiveLogs from './pages/LiveLogs';
import LogExplorer from './pages/LogExplorer';
import Security from './pages/Security';
import Servers from './pages/Servers';
import ServerDetail from './pages/ServerDetail';
import Analytics from './pages/Analytics';
import Infrastructure from './pages/Infrastructure';
import Settings from './pages/Settings';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/live-logs" element={<LiveLogs />} />
        <Route path="/logs" element={<LogExplorer />} />
        <Route path="/security" element={<Security />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/servers/:serverName" element={<ServerDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/infrastructure" element={<Infrastructure />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
