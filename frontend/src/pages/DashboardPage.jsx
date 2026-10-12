import React from 'react';
import { 
  FileText, 
  Layers, 
  Zap, 
  Clock, 
  Hammer, 
  Search, 
  BarChart3, 
  BookOpen, 
  Users, 
  GraduationCap 
} from 'lucide-react';
import MetricCard from '../components/MetricCard';

export default function DashboardPage({ stats, setActiveTab, onBuildIndex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Header */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-blue">B.Tech DSA 3 Final Project</span>
              <span className="badge badge-emerald">Team 3 • Section 13</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'white', marginBottom: '0.25rem' }}>
              Full-Text Search Engine
            </h1>
            <p style={{ color: '#06b6d4', fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem' }}>
              Suffix-Array and LCP Based Search System
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '750px' }}>
              High-performance text indexing and information retrieval engine implementing prefix-doubling 
              O(N log² N) Suffix Array construction, Kasai linear O(N) LCP algorithm, and LCP-accelerated 
              binary search across substring, prefix, and phrase query modes.
            </p>
          </div>

          {/* Project Academic Info Card */}
          <div style={{
            backgroundColor: 'rgba(11, 19, 41, 0.8)',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            minWidth: '260px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: '#60a5fa', marginBottom: '0.5rem' }}>
              <GraduationCap size={16} /> Team & Course Details
            </div>
            <div style={{ fontSize: '0.8rem', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong>Team:</strong> Team 3 (Section 13)</div>
              <div><strong>Course:</strong> DSA 3 (Academic Year 2026-2027)</div>
              <div style={{ marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid #334155', fontSize: '0.75rem', color: '#94a3b8' }}>
                <div>• Sai Krishna – 2520090156</div>
                <div>• Navaneeth – 2520090218</div>
                <div>• Chaitanya – 2520090099</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onBuildIndex}>
            <Hammer size={16} /> Build Index
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('search')}>
            <Search size={16} /> Search Documents
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={16} /> View Analytics
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('about')}>
            <BookOpen size={16} /> View Documentation
          </button>
        </div>
      </div>

      {/* Real Metric Cards Grid */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#f8fafc' }}>
          Real-Time System Metrics
        </h2>
        <div className="grid-metrics">
          <MetricCard 
            title="Documents Indexed"
            value={stats?.documents_indexed || 0}
            icon={FileText}
            color="#3b82f6"
            subtext="Active UTF-8 text files"
          />
          <MetricCard 
            title="Total Characters"
            value={(stats?.total_characters || 0).toLocaleString()}
            icon={Layers}
            color="#06b6d4"
            subtext="Concatenated corpus length (N)"
          />
          <MetricCard 
            title="Suffix Array Size"
            value={(stats?.suffix_array_size || 0).toLocaleString()}
            icon={Layers}
            color="#6366f1"
            subtext="SA[] integer elements"
          />
          <MetricCard 
            title="LCP Array Size"
            value={(stats?.lcp_array_size || 0).toLocaleString()}
            icon={Layers}
            color="#10b981"
            subtext="Kasai LCP[] elements"
          />
          <MetricCard 
            title="Last Build Time"
            value={`${stats?.total_build_time_ms || 0} ms`}
            icon={Clock}
            color="#f59e0b"
            subtext={stats?.last_build_time || 'Not built yet'}
          />
          <MetricCard 
            title="Average Latency"
            value={`${stats?.average_query_latency_ms || 0} ms`}
            icon={Zap}
            color="#f43f5e"
            subtext="LCP-accelerated search speed"
          />
        </div>
      </div>

      {/* Quick Overview Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-title">
            <Zap size={18} color="#3b82f6" /> Architecture Highlights
          </div>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>✓</span>
              <span><strong>O(N log² N) Prefix Doubling:</strong> Constructs suffix array iteratively ranking pairs of length 2^k.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
              <span><strong>Kasai Linear LCP:</strong> O(N) LCP construction reusing common prefix lengths between adjacent suffixes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>✓</span>
              <span><strong>LCP-Accelerated Search:</strong> Skips redundant prefix character comparisons in O(P + log N) time.</span>
            </li>
          </ul>
        </div>

        <div className="card">
          <div className="card-title">
            <Users size={18} color="#10b981" /> Team Contributions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ backgroundColor: '#0b1329', padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155' }}>
              <strong style={{ color: '#60a5fa' }}>Sai Krishna (2520090156):</strong> Suffix Array Construction & Kasai LCP Implementation.
            </div>
            <div style={{ backgroundColor: '#0b1329', padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155' }}>
              <strong style={{ color: '#34d399' }}>Navaneeth (2520090218):</strong> LCP Binary Search & FastAPI Backend Integration.
            </div>
            <div style={{ backgroundColor: '#0b1329', padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155' }}>
              <strong style={{ color: '#fbbf24' }}>Chaitanya (2520090099):</strong> React User Interface & Empirical Benchmarking.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
