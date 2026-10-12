import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Hammer, 
  Search, 
  BarChart3, 
  Cpu, 
  GitCompare, 
  Info 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'build', label: 'Build Index', icon: Hammer },
    { id: 'search', label: 'Search Engine', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'algorithm', label: 'Algorithm Flow', icon: Cpu },
    { id: 'comparison', label: 'Inverted Index vs SA', icon: GitCompare },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">SA</div>
        <div>
          <div className="brand-title">Suffix-Array Search</div>
          <div className="brand-sub">DSA 3 Team 3 • Sec 13</div>
        </div>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none' }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div>B.Tech DSA 3 Final Project</div>
        <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '2px' }}>
          Academic Year 2026-2027
        </div>
      </div>
    </aside>
  );
}
