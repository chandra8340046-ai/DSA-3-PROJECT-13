import React from 'react';

export default function MetricCard({ title, value, icon: Icon, color = '#3b82f6', subtext }) {
  return (
    <div className="metric-card">
      <div className="metric-icon-box" style={{ backgroundColor: `${color}20`, color }}>
        <Icon size={24} />
      </div>
      <div>
        <div className="metric-lbl">{title}</div>
        <div className="metric-val">{value}</div>
        {subtext && <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '2px' }}>{subtext}</div>}
      </div>
    </div>
  );
}
