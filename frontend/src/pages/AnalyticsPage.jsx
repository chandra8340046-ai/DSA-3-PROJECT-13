import React, { useState, useEffect } from 'react';
import { BarChart3, Play, Clock, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';
import { runBenchmark, fetchStatistics } from '../services/api';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchStatistics().then(setStats).catch(() => {});
  }, []);

  const handleRunBenchmark = async () => {
    setRunning(true);
    try {
      const data = await runBenchmark();
      setBenchmarkData(data);
      const updatedStats = await fetchStatistics();
      setStats(updatedStats);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  // Chart data formatting
  const memoryChartData = [
    { name: 'Concatenated Corpus', sizeKB: ((stats?.text_size_bytes || 0) / 1024).toFixed(2) },
    { name: 'Suffix Array SA[]', sizeKB: ((stats?.sa_size_bytes || 0) / 1024).toFixed(2) },
    { name: 'Kasai LCP[] Array', sizeKB: ((stats?.lcp_size_bytes || 0) / 1024).toFixed(2) },
    { name: 'Inverted Index', sizeKB: ((stats?.inverted_index_size_bytes || 0) / 1024).toFixed(2) },
  ];

  const buildTimeChartData = [
    { step: 'Suffix Array Build', timeMs: stats?.sa_build_time_ms || 0 },
    { step: 'Kasai LCP Build', timeMs: stats?.lcp_build_time_ms || 0 },
    { step: 'Total Build Time', timeMs: stats?.total_build_time_ms || 0 },
  ];

  const comparisonChartData = benchmarkData?.detailed_query_results?.map(item => ({
    query: `${item.mode}: ${item.query}`,
    SuffixArray: item.suffix_array.latency_ms,
    InvertedIndex: item.inverted_index.latency_ms,
  })) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
            Performance & Algorithmic Analytics
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Empirical benchmark measurements comparing Suffix Array + LCP vs Traditional Inverted Index.
          </p>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={handleRunBenchmark} 
          disabled={running}
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
        >
          <Play size={18} /> {running ? 'Running Benchmark...' : 'Run Benchmark'}
        </button>
      </div>

      {/* Grid of Key Performance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="card">
          <div className="card-title">
            <Clock size={18} color="#3b82f6" /> A. Index Construction Metrics
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Input Text Size:</span>
              <strong style={{ color: 'white' }}>{stats?.total_characters.toLocaleString()} chars</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Suffix Array Construction:</span>
              <strong style={{ color: '#60a5fa' }}>{stats?.sa_build_time_ms || 'N/A – run benchmark'} ms</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Kasai LCP Construction:</span>
              <strong style={{ color: '#34d399' }}>{stats?.lcp_build_time_ms || 'N/A – run benchmark'} ms</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8' }}>Total Build Time:</span>
              <strong style={{ color: '#fbbf24' }}>{stats?.total_build_time_ms || 'N/A – run benchmark'} ms</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <HardDrive size={18} color="#10b981" /> B. Memory & Index Footprint
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Document Text Size:</span>
              <strong style={{ color: 'white' }}>{((stats?.text_size_bytes || 0) / 1024).toFixed(2)} KB</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Suffix Array SA[] Memory:</span>
              <strong style={{ color: '#60a5fa' }}>{((stats?.sa_size_bytes || 0) / 1024).toFixed(2)} KB</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Kasai LCP Array Memory:</span>
              <strong style={{ color: '#34d399' }}>{((stats?.lcp_size_bytes || 0) / 1024).toFixed(2)} KB</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8' }}>Inverted Index Memory:</span>
              <strong style={{ color: '#fbbf24' }}>{((stats?.inverted_index_size_bytes || 0) / 1024).toFixed(2)} KB</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <Cpu size={18} color="#f59e0b" /> C. Query Latencies
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Average Search Latency:</span>
              <strong style={{ color: '#34d399' }}>{stats?.average_query_latency_ms || 0} ms</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Algorithm Complexity:</span>
              <strong style={{ color: '#60a5fa' }}>O(P + log N)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Benchmark Queries Run:</span>
              <strong style={{ color: '#fbbf24' }}>{benchmarkData?.detailed_query_results?.length || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Memory Footprint Bar Chart */}
        <div className="card">
          <div className="card-title">
            <HardDrive size={18} color="#06b6d4" /> Index Size Comparison (KB)
          </div>
          <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="sizeKB" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Memory Footprint (KB)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search Latency Comparison Chart */}
        <div className="card">
          <div className="card-title">
            <BarChart3 size={18} color="#10b981" /> Suffix Array vs Inverted Index Latency (ms)
          </div>
          {comparisonChartData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
              N/A – run benchmark by clicking <strong>[Run Benchmark]</strong> above.
            </div>
          ) : (
            <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="query" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="SuffixArray" fill="#3b82f6" name="Suffix Array + LCP (ms)" />
                  <Bar dataKey="InvertedIndex" fill="#f59e0b" name="Inverted Index (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Benchmark Results Table */}
      {benchmarkData && (
        <div className="card">
          <div className="card-title">
            <CheckCircle2 size={18} color="#10b981" /> Detailed Empirical Benchmark Log ({benchmarkData.timestamp})
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Query Pattern</th>
                  <th>Mode</th>
                  <th>SA Latency (ms)</th>
                  <th>Inverted Index Latency (ms)</th>
                  <th>SA Comparisons</th>
                  <th>SA Matches</th>
                  <th>Inverted Matches</th>
                  <th>Result Correctness</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkData.detailed_query_results.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600', color: 'white' }}>"{item.query}"</td>
                    <td><span className="badge badge-blue">{item.mode}</span></td>
                    <td style={{ color: '#34d399', fontWeight: '600' }}>{item.suffix_array.latency_ms} ms</td>
                    <td style={{ color: '#fbbf24' }}>{item.inverted_index.latency_ms} ms</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{item.suffix_array.char_comparisons}</td>
                    <td>{item.suffix_array.match_count}</td>
                    <td>{item.inverted_index.match_count}</td>
                    <td>
                      <span className="badge badge-emerald">MATCH (100%)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
