import React, { useState, useEffect } from 'react';
import { X, FileText, Hash, Award, Eye } from 'lucide-react';
import { fetchDocumentDetails } from '../services/api';

export default function DocumentViewerModal({ docName, query, resultData, onClose }) {
  const [docContent, setDocContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (docName) {
      setLoading(true);
      fetchDocumentDetails(docName)
        .then((data) => {
          setDocContent(data.content || '');
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [docName]);

  if (!docName) return null;

  const highlightMatches = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f172a',
        borderColor: '#334155'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid #334155'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText color="#3b82f6" size={24} />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'white' }}>{docName}</h3>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Document Inspector</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Metadata Bar */}
        {resultData && (
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '0.85rem',
            margin: '1rem 0',
            backgroundColor: '#1e293b',
            borderRadius: '8px',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={15} color="#3b82f6" />
              <span>Relevance: <strong>{resultData.relevance_score}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Hash size={15} color="#10b981" />
              <span>Frequency: <strong>{resultData.match_frequency} matches</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Eye size={15} color="#f59e0b" />
              <span>Mode: <strong>{resultData.query_type}</strong></span>
            </div>
          </div>
        )}

        {/* Match Positions Chip List */}
        {resultData?.match_positions && (
          <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            <strong>Matched Character Offsets:</strong>{' '}
            {resultData.match_positions.map((pos, idx) => (
              <span key={idx} className="badge badge-blue" style={{ marginRight: '0.35rem', marginBottom: '0.25rem' }}>
                Pos: {pos}
              </span>
            ))}
          </div>
        )}

        {/* Main Content Viewer */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          backgroundColor: '#0b1329',
          borderRadius: '8px',
          border: '1px solid #334155',
          fontSize: '0.925rem',
          lineHeight: '1.7',
          whiteSpace: 'pre-wrap',
          color: '#e2e8f0',
          fontFamily: 'var(--font-mono)'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>Loading document...</div>
          ) : (
            highlightMatches(docContent, query)
          )}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #334155',
          textAlign: 'right'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>Close Viewer</button>
        </div>
      </div>
    </div>
  );
}
