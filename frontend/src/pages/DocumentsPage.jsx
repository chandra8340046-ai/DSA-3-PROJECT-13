import React, { useState, useRef } from 'react';
import { Upload, Trash2, Hammer, CheckCircle2, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { uploadDocument, deleteDocument } from '../services/api';

export default function DocumentsPage({ documents, stats, onRefresh, onBuildIndex, onOpenDocument }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      await uploadDocument(file);
      setMessage({ type: 'success', text: `Document "${file.name}" uploaded successfully and index rebuilt!` });
      await onRefresh();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to upload file.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to remove ${filename}?`)) return;

    try {
      await deleteDocument(filename);
      setMessage({ type: 'success', text: `Document "${filename}" removed and index rebuilt.` });
      await onRefresh();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to remove document.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Action Header Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.25rem' }}>
            Document Ingestion & Management
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Upload UTF-8 plain text files to build and update the unified Suffix Array corpus.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".txt" 
            style={{ display: 'none' }} 
          />
          <button 
            className="btn btn-primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Document (.txt)'}
          </button>

          <button className="btn btn-secondary" onClick={onBuildIndex}>
            <Hammer size={16} /> Build / Rebuild Index
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          color: message.type === 'success' ? '#34d399' : '#f43f5e',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Index Build Success Summary Panel */}
      {stats?.is_built && (
        <div className="card" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderColor: '#3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontWeight: '600', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={18} /> Index Built Successfully
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div><span style={{ color: '#94a3b8' }}>Total Documents:</span> <strong style={{ color: 'white' }}>{stats.documents_indexed}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Combined Text Length:</span> <strong style={{ color: '#06b6d4' }}>{stats.total_characters} chars</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Suffix Array Size:</span> <strong style={{ color: '#6366f1' }}>{stats.suffix_array_size}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>LCP Array Size:</span> <strong style={{ color: '#34d399' }}>{stats.lcp_array_size}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Build Time:</span> <strong style={{ color: '#fbbf24' }}>{stats.total_build_time_ms} ms</strong></div>
          </div>
        </div>
      )}

      {/* Documents List Table */}
      <div className="card">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="#3b82f6" /> Ingested Documents Corpus ({documents.length})
          </div>
          <button className="btn btn-secondary" onClick={onRefresh} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Refresh List
          </button>
        </div>

        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            No text documents in dataset. Click "Upload Document" to add files.
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>File Size</th>
                  <th>Character Count</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: '600', color: 'white' }}>
                      <button 
                        onClick={() => onOpenDocument(doc.name)}
                        style={{ background: 'none', border: 'none', color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}
                      >
                        {doc.name}
                      </button>
                    </td>
                    <td>{(doc.size_bytes / 1024).toFixed(2)} KB</td>
                    <td>{doc.char_count.toLocaleString()} chars</td>
                    <td>
                      <span className="badge badge-emerald">{doc.status}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => onOpenDocument(doc.name)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(doc.name)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
