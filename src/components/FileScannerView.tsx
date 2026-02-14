import { useState } from 'react';
import { Upload, FileSearch, AlertCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';

type ScanResultType = {
  status: 'clean' | 'malicious' | 'suspicious';
  threatScore: number;
  details: {
    fileName: string;
    fileSize: number;
    fileType: string;
    threats: string[];
    signatures: string[];
  };
};

export function FileScannerView() {
  const { user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResultType | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setFileName(file.name);
    setScanning(true);
    setResult(null);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult: ScanResultType = {
      status: Math.random() > 0.7 ? 'malicious' : Math.random() > 0.5 ? 'suspicious' : 'clean',
      threatScore: Math.floor(Math.random() * 100),
      details: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'unknown',
        threats: Math.random() > 0.6 ? ['Trojan.Generic', 'Malware.Suspicious'] : [],
        signatures: ['MD5: ' + Math.random().toString(36).substring(7)],
      },
    };

    setResult(mockResult);
    setScanning(false);

    await fetch("http://127.0.0.1:8000/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: file.name,
        status: result.status,
        threat_score: result.threatScore
      })
    });

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
          <h2 className="text-3xl font-bold text-white mb-2">File Scanner</h2>
          <p className="text-slate-400">Upload and analyze files for malware and threats</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-6">
            <label
              htmlFor="file-upload"
              className="block cursor-pointer"
            >
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-cyan-500 transition">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl mb-4">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Support for executables, archives, documents, and more
                  </p>
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={scanning}
              />
            </label>
          </div>

          {scanning && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Scanning {fileName}...</h3>
              <p className="text-slate-400">Analyzing file for threats and malware</p>
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
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">File Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">File Name</p>
                      <p className="text-white font-medium">{result.details.fileName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">File Size</p>
                      <p className="text-white font-medium">
                        {(result.details.fileSize / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">File Type</p>
                      <p className="text-white font-medium">{result.details.fileType}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Threat Score</p>
                      <p className="text-white font-medium">{result.threatScore}/100</p>
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
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">File Signatures</h4>
                  <div className="space-y-1">
                    {result.details.signatures.map((sig, idx) => (
                      <p key={idx} className="text-sm text-slate-300 font-mono">
                        {sig}
                      </p>
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
