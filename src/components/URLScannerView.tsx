import { useState } from 'react';
import { Link2, Search, AlertCircle, CheckCircle, AlertTriangle, Loader2, Globe } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

type ScanResultType = {
  status: 'clean' | 'malicious' | 'suspicious';
  threatScore: number;
  details: {
    url: string;
    domain: string;
    reputation: string;
    threats: string[];
    categories: string[];
    lastSeen: string;
  };
};

export function URLScannerView() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResultType | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !user) return;

    setScanning(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult: ScanResultType = {
      status: Math.random() > 0.7 ? 'malicious' : Math.random() > 0.5 ? 'suspicious' : 'clean',
      threatScore: Math.floor(Math.random() * 100),
      details: {
        url: url,
        domain: new URL(url).hostname,
        reputation: Math.random() > 0.5 ? 'Trusted' : 'Unknown',
        threats: Math.random() > 0.6 ? ['Phishing', 'Malware Distribution'] : [],
        categories: ['Technology', 'Web Services'],
        lastSeen: new Date().toISOString(),
      },
    };

    setResult(mockResult);
    setScanning(false);

    await supabase.from('scan_results').insert({
      user_id: user.id,
      scan_type: 'url',
      target: url,
      status: mockResult.status,
      threat_score: mockResult.threatScore,
      details: mockResult.details,
    });
  };

  const getStatusIcon = () => {
    if (!result) return null;
    switch (result.status) {
      case 'clean':
        return <CheckCircle className="w-16 h-16 text-green-400" />;
      case 'malicious':
        return <AlertCircle className="w-16 h-16 text-red-400" />;
      case 'suspicious':
        return <AlertTriangle className="w-16 h-16 text-yellow-400" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return '';
    switch (result.status) {
      case 'clean':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'malicious':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'suspicious':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  return (
    <div className="flex-1 bg-slate-900 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">URL Scanner</h2>
          <p className="text-slate-400">Analyze URLs for phishing, malware, and security threats</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-6">
            <form onSubmit={handleScan} className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    required
                    disabled={scanning}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={scanning}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Scan URL
              </button>
            </form>
          </div>

          {scanning && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Scanning URL...</h3>
              <p className="text-slate-400">Checking reputation, threats, and security status</p>
            </div>
          )}

          {result && !scanning && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">{getStatusIcon()}</div>
                <h3 className="text-2xl font-bold text-white mb-2">Scan Complete</h3>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor()}`}
                >
                  {result.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">URL Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                      <p className="text-slate-500">URL</p>
                      <p className="text-white font-medium break-all">{result.details.url}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Domain</p>
                      <p className="text-white font-medium">{result.details.domain}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Reputation</p>
                      <p className="text-white font-medium">{result.details.reputation}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Threat Score</p>
                      <p className="text-white font-medium">{result.threatScore}/100</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Last Seen</p>
                      <p className="text-white font-medium">
                        {new Date(result.details.lastSeen).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {result.details.threats.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Threats Detected</h4>
                    <ul className="space-y-2">
                      {result.details.threats.map((threat, idx) => (
                        <li key={idx} className="text-sm text-red-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          {threat}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.details.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-full text-sm text-slate-300"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
