import React from 'react';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, stats, onRebuild }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'System Dashboard';
      case 'documents': return 'Document Ingestion & Management';
      case 'build': return 'Index Construction & Inspection';
      case 'search': return 'LCP-Accelerated Full-Text Search';
      case 'results': return 'Search Results & Context Analysis';
      case 'analytics': return 'Performance & Latency Benchmarks';
      case 'algorithm': return 'Algorithm Visualization & Data Structures';
      case 'comparison': return 'Suffix Array vs Inverted Index';
      case 'about': return 'Project Metadata & Documentation';
      default: return 'Full-Text Search Engine';
    }
  };

  return (
    <header className="top-header">
      <div className="header-title">
        <Database size={20} className="text-blue-400" style={{ color: '#3b82f6' }} />
        <span>{getTitle()}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          {stats?.is_built ? (
            <span className="badge badge-emerald" style={{ gap: '0.35rem' }}>
              <CheckCircle2 size={13} /> Index Active
            </span>
          ) : (
            <span className="badge badge-amber" style={{ gap: '0.35rem' }}>
              <AlertCircle size={13} /> Index Not Built
            </span>
          )}
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={onRebuild}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
        >
          Rebuild Index
        </button>
      </div>
    </header>
  );
}
