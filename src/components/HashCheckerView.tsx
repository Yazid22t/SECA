import { useState } from 'react';
import { Hash, Search, AlertCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type ScanResultType = {
  status: 'clean' | 'malicious' | 'suspicious';
  threatScore: number;
  details: {
    hash: string;
    hashType: string;
    found: boolean;
    firstSeen: string;
    lastSeen: string;
    detections: number;
    engines: number;
    malwareFamily: string[];
  };
};

export function HashCheckerView() {
  const { user } = useAuth();
  const [hash, setHash] = useState('');
  const [hashType, setHashType] = useState<'MD5' | 'SHA1' | 'SHA256'>('MD5');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResultType | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hash || !user) return;

    setScanning(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const found = Math.random() > 0.5;
    const mockResult: ScanResultType = {
      status: found && Math.random() > 0.7 ? 'malicious' : found && Math.random() > 0.5 ? 'suspicious' : 'clean',
      threatScore: found ? Math.floor(Math.random() * 100) : 0,
      details: {
        hash: hash,
        hashType: hashType,
        found: found,
        firstSeen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastSeen: new Date().toISOString(),
        detections: found ? Math.floor(Math.random() * 50) : 0,
        engines: 70,
        malwareFamily: found && Math.random() > 0.5 ? ['Trojan.Gen', 'Win32.Malware'] : [],
      },
    };

    setResult(mockResult);
    setScanning(false);

    await supabase.from('scan_results').insert({
      user_id: user.id,
      scan_type: 'hash',
      target: hash,
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
          <h2 className="text-3xl font-bold text-white mb-2">Hash Checker</h2>
          <p className="text-slate-400">Check file hashes against malware databases</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-6">
            <form onSubmit={handleCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hash Type
                </label>
                <div className="flex gap-3">
                  {(['MD5', 'SHA1', 'SHA256'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setHashType(type)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        hashType === type
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-slate-900/50 border border-slate-600 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hash Value
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={hash}
                        onChange={(e) => setHash(e.target.value)}
                        placeholder="Enter hash value..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition font-mono"
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
                    Check Hash
                  </button>
                </div>
              </div>
            </form>
          </div>

          {scanning && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Checking Hash...</h3>
              <p className="text-slate-400">Searching malware databases and threat feeds</p>
            </div>
          )}

          {result && !scanning && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">{getStatusIcon()}</div>
                <h3 className="text-2xl font-bold text-white mb-2">Check Complete</h3>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor()}`}
                >
                  {result.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Hash Information</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-500">Hash Value</p>
                      <p className="text-white font-mono break-all">{result.details.hash}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500">Hash Type</p>
                        <p className="text-white font-medium">{result.details.hashType}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Found in Database</p>
                        <p className="text-white font-medium">
                          {result.details.found ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {result.details.found && (
                  <>
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">Detection Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Detections</p>
                          <p className="text-white font-medium">
                            {result.details.detections}/{result.details.engines}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Threat Score</p>
                          <p className="text-white font-medium">{result.threatScore}/100</p>
                        </div>
                        <div>
                          <p className="text-slate-500">First Seen</p>
                          <p className="text-white font-medium">
                            {new Date(result.details.firstSeen).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Last Seen</p>
                          <p className="text-white font-medium">
                            {new Date(result.details.lastSeen).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {result.details.malwareFamily.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-red-400 mb-2">Malware Family</h4>
                        <ul className="space-y-2">
                          {result.details.malwareFamily.map((family, idx) => (
                            <li key={idx} className="text-sm text-red-300 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              {family}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
