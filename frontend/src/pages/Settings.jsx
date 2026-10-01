import { useState } from 'react';

const DEFAULT_SETTINGS = {
  platformName: 'LOGNEX Cloud Analytics',
  themePreference: localStorage.getItem('lognex-theme') || 'light',
  refreshInterval: '2 Seconds',
  retentionDays: '30',
  emailAlerts: true,
  slackWebhook: ''
};

function readSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('lognex-settings') || '{}') };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Settings() {
  const [settings, setSettings] = useState(readSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (key, value) => {
    setSettings(current => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem('lognex-settings', JSON.stringify(settings));
    localStorage.setItem('lognex-theme', settings.themePreference);
    document.documentElement.classList.toggle('dark', settings.themePreference === 'dark');
    window.dispatchEvent(new CustomEvent('lognex-theme-change', { detail: settings.themePreference }));
    setSaved(true);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">System Settings</h2>
        <p className="text-gray-400">Configure LOGNEX platform preferences and integrations.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">General Configuration</h3>
          <div className="grid gap-4 max-w-xl">
            <div>
              <label htmlFor="platform-name" className="block text-sm font-medium text-gray-400 mb-1">Platform Name</label>
              <input id="platform-name" type="text" value={settings.platformName} onChange={event => updateSetting('platformName', event.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label htmlFor="theme-preference" className="block text-sm font-medium text-gray-400 mb-1">Theme Preference</label>
              <select id="theme-preference" value={settings.themePreference} onChange={event => updateSetting('themePreference', event.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-accent-blue">
                <option value="light">Light</option>
                <option value="dark">Dark (Cybersecurity)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Monitoring &amp; Retention</h3>
          <div className="grid gap-4 max-w-xl">
            <div>
              <label htmlFor="refresh-interval" className="block text-sm font-medium text-gray-400 mb-1">Live Logs Refresh Interval</label>
              <select id="refresh-interval" value={settings.refreshInterval} onChange={event => updateSetting('refreshInterval', event.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-accent-blue">
                <option>1 Second</option>
                <option>2 Seconds</option>
                <option>5 Seconds</option>
                <option>Manual</option>
              </select>
            </div>
            <div>
              <label htmlFor="retention-days" className="block text-sm font-medium text-gray-400 mb-1">Log Retention Period (Days)</label>
              <input id="retention-days" type="number" min="1" value={settings.retentionDays} onChange={event => updateSetting('retentionDays', event.target.value)} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-accent-blue" />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-dark-700">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Alerts &amp; Notifications</h3>
          <div className="grid gap-4 max-w-xl">
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-700">
              <div>
                <span className="block font-medium text-gray-200">Email Alerts</span>
                <span className="text-sm text-gray-500">Receive critical security alerts via email</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.emailAlerts} onChange={event => updateSetting('emailAlerts', event.target.checked)} />
                <span className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></span>
              </label>
            </div>
            <div>
              <label htmlFor="slack-webhook" className="block text-sm font-medium text-gray-400 mb-1">Slack Webhook URL</label>
              <input id="slack-webhook" type="password" value={settings.slackWebhook} onChange={event => updateSetting('slackWebhook', event.target.value)} placeholder="Enter Slack webhook URL" className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-accent-blue" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-dark-800/50 flex items-center gap-4">
          <button type="submit" className="bg-accent-blue hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Save Changes
          </button>
          {saved && <span role="status" className="text-sm font-medium text-accent-green">Settings saved.</span>}
        </div>
      </form>
    </div>
  );
}
