import React from 'react';
import { GraduationCap, Users, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  const screenshots = [
    { num: 1, name: 'Main Dashboard', section: '7.5 User Interface' },
    { num: 2, name: 'Document Upload & Ingestion', section: '7.5 Application Implementation' },
    { num: 3, name: 'Index Building & Statistics', section: '7.5 Index Build Layer' },
    { num: 4, name: 'Search Page with Query Modes', section: '7.5 Query Processing' },
    { num: 5, name: 'Search Results with Snippets', section: '7.5 Ranked Results Output' },
    { num: 6, name: 'Result Details Document Inspector', section: '7.5 Match Highlighting' },
    { num: 7, name: 'Algorithm Visualization Flow', section: '7.5 Data Structure Inspection' },
    { num: 8, name: 'Performance Analytics Dashboard', section: '7.6 Testing & Benchmarks' },
    { num: 9, name: 'Suffix Array / Kasai LCP Samples', section: '7.7 Final Output' },
    { num: 10, name: 'Suffix Array vs Inverted Index Comparison', section: '7.7 Comparative Analysis' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <GraduationCap size={24} color="#3b82f6" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>
            Project Metadata & Academic Documentation
          </h2>
        </div>
        <p style={{ color: '#06b6d4', fontSize: '1.05rem', fontWeight: '600' }}>
          Full-Text Search Engine on a Suffix-Array Index with Kasai LCP
        </p>
      </div>

      {/* Team Details Grid */}
      <div className="card">
        <div className="card-title">
          <Users size={18} color="#3b82f6" /> Team & Project Information
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#0b1329', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Academic Unit</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white', marginTop: '4px' }}>DSA 3 • Section 13</div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '2px' }}>Academic Year 2026-2027</div>
          </div>

          <div style={{ backgroundColor: '#0b1329', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Team Name</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#60a5fa', marginTop: '4px' }}>Team 3</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>B.Tech Final Review</div>
          </div>

          <div style={{ backgroundColor: '#0b1329', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Team Members</div>
            <div style={{ fontSize: '0.85rem', color: 'white', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div>• <strong>Sai Krishna</strong> – 2520090156</div>
              <div>• <strong>Navaneeth</strong> – 2520090218</div>
              <div>• <strong>Chaitanya</strong> – 2520090099</div>
            </div>
          </div>
        </div>
      </div>

      {/* Required Project Review Screenshots Reference List */}
      <div className="card">
        <div className="card-title">
          <ShieldCheck size={18} color="#10b981" /> Required Screenshots for Project Review Report
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Capture the following 10 interface views for inclusion under sections 7.5, 7.6, and 7.7 of your final project report:
        </p>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Item #</th>
                <th>Screenshot View Name</th>
                <th>Project Report Section</th>
                <th>Corresponding App Tab</th>
              </tr>
            </thead>
            <tbody>
              {screenshots.map((s) => (
                <tr key={s.num}>
                  <td style={{ fontWeight: '700', color: '#60a5fa' }}>#{s.num}</td>
                  <td style={{ fontWeight: '600', color: 'white' }}>{s.name}</td>
                  <td><span className="badge badge-emerald">{s.section}</span></td>
                  <td style={{ color: '#94a3b8' }}>{s.name.split(' ')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
