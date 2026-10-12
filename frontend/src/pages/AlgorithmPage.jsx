import React, { useState, useEffect } from 'react';
import { Cpu, Table, Layers, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchSuffixArraySample, fetchLcpSample } from '../services/api';

export default function AlgorithmPage() {
  const [saSample, setSaSample] = useState([]);
  const [lcpSample, setLcpSample] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSamples = () => {
    setLoading(true);
    Promise.all([
      fetchSuffixArraySample(30),
      fetchLcpSample(30)
    ]).then(([saRes, lcpRes]) => {
      setSaSample(saRes.sample || []);
      setLcpSample(lcpRes.sample || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    loadSamples();
  }, []);

  const steps = [
    { num: 1, title: 'Load Documents', desc: 'Ingest raw UTF-8 plain-text files from dataset repository.' },
    { num: 2, title: 'Normalize Text', desc: 'Clean text and unify casing for consistent matching.' },
    { num: 3, title: 'Combine Text with Sentinel Separators', desc: 'Concatenate documents separated by unique sentinels (\\x01, \\x02) to track document boundaries.' },
    { num: 4, title: 'Build Suffix Array (SA[])', desc: 'Construct sorted array of all text suffixes using O(N log² N) prefix-doubling algorithm.' },
    { num: 5, title: 'Build LCP Array using Kasai Algorithm', desc: 'Compute Longest Common Prefix lengths between adjacent suffixes in linear O(N) time.' },
    { num: 6, title: 'Receive Search Query', desc: 'Accept user query string and selected search mode (Substring, Prefix, Phrase).' },
    { num: 7, title: 'Perform LCP-Accelerated Binary Search', desc: 'Binary search over SA[] using LCP values to skip redundant character comparisons in O(P + log N) time.' },
    { num: 8, title: 'Find Matching Suffix Range [L, R]', desc: 'Identify lower and upper bounds in SA[] containing all matching suffixes.' },
    { num: 9, title: 'Map Matches to Source Documents', desc: 'Convert global text offset SA[k] into source document ID and local character offset.' },
    { num: 10, title: 'Rank Results', desc: 'Compute relevance score based on match frequency, position bonus, density, and query mode.' },
    { num: 11, title: 'Display Results', desc: 'Render ranked document matches with highlighted context snippets in search UI.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
          How the Search Algorithm Works
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Complete 11-step architectural execution pipeline of the Suffix Array and Kasai LCP search system.
        </p>
      </div>

      {/* 11-Step Visual Workflow Pipeline */}
      <div className="card">
        <div className="card-title">
          <Cpu size={18} color="#3b82f6" /> Algorithm Execution Pipeline
        </div>

        <div className="step-pipeline">
          {steps.map((s) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '0.2rem' }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Data Structure Inspection Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
        {/* Suffix Array Inspector Table */}
        <div className="card">
          <div className="card-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Table size={18} color="#60a5fa" /> Suffix Array SA[] Sample
            </div>
            <button className="btn btn-secondary" onClick={loadSamples} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
              <RefreshCw size={12} /> Reload
            </button>
          </div>

          <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>SA Index i</th>
                  <th>Suffix Start SA[i]</th>
                  <th>Suffix String Preview (Text[SA[i]:])</th>
                </tr>
              </thead>
              <tbody>
                {saSample.map((item) => (
                  <tr key={item.sa_index}>
                    <td style={{ fontWeight: '600', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{item.sa_index}</td>
                    <td style={{ fontWeight: '600', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{item.suffix_start}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0' }}>{item.suffix_preview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kasai LCP Array Inspector Table */}
        <div className="card">
          <div className="card-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="#34d399" /> Kasai LCP[] Array Sample
            </div>
            <button className="btn btn-secondary" onClick={loadSamples} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
              <RefreshCw size={12} /> Reload
            </button>
          </div>

          <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Index i</th>
                  <th>SA[i]</th>
                  <th>LCP[i]</th>
                  <th>Suffix Preview (SA[i])</th>
                </tr>
              </thead>
              <tbody>
                {lcpSample.map((item) => (
                  <tr key={item.index}>
                    <td style={{ fontWeight: '600', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{item.index}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{item.sa_start}</td>
                    <td style={{ fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)' }}>{item.lcp_value}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0' }}>{item.suffix_preview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
