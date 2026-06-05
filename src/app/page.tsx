'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [scanStatus, setScanStatus] = useState<'idle'|'scanning'|'done'|'error'>('idle');
  const [results, setResults] = useState<any>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://api.github.com/users/Raphasha27/repos?sort=updated&per_page=5')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch(err => console.error(err));
  }, []);

  const runScan = async (targetUrl: string) => {
    setScanStatus('scanning');
    setResults(null);
    setAiReport('');
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      if (data.success) {
        setResults(data);
        setScanStatus('done');
        generateAIReport(data);
      } else {
        setScanStatus('error');
      }
    } catch (e) {
      setScanStatus('error');
    }
  };

  const generateAIReport = async (scanData: any) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanData })
      });
      const data = await res.json();
      if (data.success) {
        setAiReport(data.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="kirov-container">
      <header className="kirov-header">
        <div style={{color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px'}}>
          KIROV DYNAMICS TECHNOLOGY
        </div>
        <h1 className="kirov-title">Defensive Posture Analyzer</h1>
        <p className="kirov-subtitle">AI-driven reconnaissance and passive vulnerability assessment.</p>
      </header>

      <main>
        <div className="kirov-card github-section">
          <h3 style={{marginTop: 0, color: 'var(--accent)'}}>Raphasha27 Repository Scanner</h3>
          <p style={{color: 'var(--text-secondary)'}}>Select a recent repository to analyze its GitHub page defensive headers:</p>
          <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            {repos.map(repo => (
              <button 
                key={repo.id}
                onClick={() => {
                  setUrl(repo.html_url);
                  runScan(repo.html_url);
                }}
                className="kirov-btn"
                style={{backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', color: '#fff'}}
              >
                {repo.name}
              </button>
            ))}
          </div>
        </div>

        <div className="kirov-card">
          <div className="kirov-input-group">
            <input 
              type="text" 
              className="kirov-input"
              placeholder="Enter target URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runScan(url)}
            />
            <button 
              className="kirov-btn"
              onClick={() => runScan(url)}
              disabled={scanStatus === 'scanning' || !url}
            >
              {scanStatus === 'scanning' ? 'Scanning...' : 'Initiate Scan'}
            </button>
          </div>
        </div>

        {scanStatus === 'error' && (
          <div className="kirov-card" style={{borderColor: 'var(--error)'}}>
            <p style={{color: 'var(--error)', margin: 0}}>Error: Could not connect to the target URL.</p>
          </div>
        )}

        {scanStatus === 'done' && results && (
          <div className="kirov-grid">
            <div className="kirov-card">
              <h3 style={{marginTop: 0}}>Security Headers</h3>
              {Object.entries(results.results).map(([header, info]: any) => (
                <div key={header} className="item-row">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <strong style={{fontFamily: 'monospace'}}>{header}</strong>
                    <span className={`badge ${info.status === 'Present' ? 'badge-present' : 'badge-missing'}`}>
                      {info.status}
                    </span>
                  </div>
                  {info.status === 'Missing' && <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px'}}>{info.message}</div>}
                </div>
              ))}
            </div>

            <div>
              <div className="kirov-card">
                <h3 style={{marginTop: 0}}>Tech Stack & Fingerprint</h3>
                {results.techStack.map((tech: string, i: number) => (
                  <div key={i} className="item-row" style={{fontFamily: 'monospace', color: 'var(--text-secondary)'}}>
                    {tech}
                  </div>
                ))}
              </div>

              <div className="kirov-card">
                <h3 style={{marginTop: 0}}>Cookie Security</h3>
                {results.cookieIssues.map((issue: string, i: number) => (
                  <div key={i} className="item-row" style={{color: issue.includes('No cookie') ? 'var(--text-secondary)' : 'var(--error)'}}>
                    {issue}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(analyzing || aiReport) && (
          <div className="kirov-card" style={{border: '1px solid var(--accent)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '15px'}}>
              <h2 style={{margin: 0, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <span style={{display: 'inline-block', width: '8px', height: '8px', backgroundColor: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent)'}}></span>
                AI Remediation Engine
              </h2>
              {aiReport && (
                <button onClick={printReport} className="kirov-btn" style={{padding: '8px 16px', fontSize: '0.9rem'}}>
                  Export PDF
                </button>
              )}
            </div>
            
            {analyzing ? (
              <p style={{color: 'var(--text-secondary)', fontFamily: 'monospace'}}>Synthesizing defensive posture report...</p>
            ) : (
              <div className="markdown-body" style={{whiteSpace: 'pre-wrap'}}>
                {aiReport}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
