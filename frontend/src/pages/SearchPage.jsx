import React, { useState } from 'react';
import { Search, Zap, Filter, SlidersHorizontal, BookOpen, AlertTriangle } from 'lucide-react';
import { executeSearch } from '../services/api';

export default function SearchPage({ onOpenDocumentModal, isIndexBuilt }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('substring');
  const [limit, setLimit] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setErrorMsg(null);

    try {
      const data = await executeSearch(query, mode, limit);
      if (data.error) {
        setErrorMsg(data.error);
        setSearchResults(null);
      } else {
        setSearchResults(data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Search failed. Make sure index is built.');
      setSearchResults(null);
    } finally {
      setSearching(false);
    }
  };

  const setExampleQuery = (q, m) => {
    setQuery(q);
    setMode(m);
    // Execute search immediately
    setSearching(true);
    setErrorMsg(null);
    executeSearch(q, m, limit)
      .then(data => setSearchResults(data))
      .catch(err => setErrorMsg(err.message))
      .finally(() => setSearching(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Index Warning Banner */}
      {!isIndexBuilt && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem'
        }}>
          <AlertTriangle size={20} />
          <span>No index has been built yet. Upload documents and build the index first.</span>
        </div>
      )}

      {/* Main Search Interface Card */}
      <div className="card" style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
          LCP-Accelerated Suffix Array Search
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Find arbitrary substrings, word prefixes, or multi-word phrases across the document collection using binary search over SA[].
        </p>

        <form onSubmit={handleSearch}>
          {/* Large Search Box */}
          <div className="search-box-wrapper">
            <Search className="search-icon-pos" size={22} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Enter your search query... (e.g. array, suffix array, kasai)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* Controls Row: Mode Selector & Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8' }}>Query Type:</span>
              
              {[
                { id: 'substring', label: 'Substring' },
                { id: 'prefix', label: 'Prefix' },
                { id: 'phrase', label: 'Phrase' },
              ].map(m => (
                <label key={m.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.875rem',
                  color: mode === m.id ? '#60a5fa' : '#94a3b8',
                  fontWeight: mode === m.id ? '600' : '400',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="radio" 
                    name="queryMode" 
                    checked={mode === m.id} 
                    onChange={() => setMode(m.id)}
                    style={{ accentColor: '#3b82f6' }}
                  />
                  {m.label}
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{ padding: '0.6rem 0.85rem' }}
              >
                <SlidersHorizontal size={16} /> Advanced
              </button>

              <button type="submit" className="btn btn-primary" disabled={searching}>
                <Search size={16} /> {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Advanced Options Panel */}
          {showAdvanced && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#0b1329',
              borderRadius: '8px',
              border: '1px solid #334155',
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ color: '#94a3b8', marginRight: '0.5rem' }}>Maximum Results:</label>
                <select 
                  value={limit} 
                  onChange={(e) => setLimit(Number(e.target.value))}
                  style={{
                    backgroundColor: '#1e293b',
                    color: 'white',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '0.35rem 0.65rem'
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div>
                <span style={{ color: '#94a3b8' }}>Ranking Mode: </span>
                <strong style={{ color: '#34d399' }}>TF-Density & Position Weighted</strong>
              </div>
            </div>
          )}

          {/* Example Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
            <span style={{ color: '#64748b' }}>Try example queries:</span>
            <button 
              type="button" 
              className="badge badge-blue" 
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => setExampleQuery('array', 'substring')}
            >
              substring: "array"
            </button>
            <button 
              type="button" 
              className="badge badge-emerald" 
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => setExampleQuery('data', 'prefix')}
            >
              prefix: "data"
            </button>
            <button 
              type="button" 
              className="badge badge-amber" 
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => setExampleQuery('suffix array', 'phrase')}
            >
              phrase: "suffix array"
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="card" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)', color: '#f43f5e' }}>
          {errorMsg}
        </div>
      )}

      {/* Search Performance Metrics Bar */}
      {searchResults?.performance && (
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1.25rem',
          backgroundColor: '#0b1329',
          borderRadius: '8px',
          border: '1px solid #334155',
          fontSize: '0.85rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div><span style={{ color: '#94a3b8' }}>Matches Found:</span> <strong style={{ color: '#60a5fa' }}>{searchResults.total_matches}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>SA Latency:</span> <strong style={{ color: '#34d399' }}>{searchResults.performance.suffix_array_latency_ms} ms</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Character Comparisons:</span> <strong style={{ color: '#fbbf24' }}>{searchResults.performance.character_comparisons}</strong></div>
            {searchResults.sa_range?.L !== undefined && (
              <div><span style={{ color: '#94a3b8' }}>SA Index Range:</span> <strong style={{ color: '#c084fc' }}>[{searchResults.sa_range.L}, {searchResults.sa_range.R}]</strong></div>
            )}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.775rem' }}>
            LCP Acceleration Active
          </div>
        </div>
      )}

      {/* Ranked Search Results List */}
      {searchResults && (
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: 'white' }}>
            Search Results ({searchResults.results.length})
          </h3>

          {searchResults.results.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No document matches found for query "{searchResults.query}".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {searchResults.results.map((res, idx) => (
                <div key={idx} className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: '700', textTransform: 'uppercase' }}>
                        Result #{idx + 1}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>
                        {res.doc_name}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.85rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Relevance</div>
                        <strong style={{ color: '#34d399', fontSize: '1rem' }}>{res.relevance_score}</strong>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.725rem', color: '#94a3b8' }}>Frequency</div>
                        <strong style={{ color: '#60a5fa', fontSize: '1rem' }}>{res.match_frequency} matches</strong>
                      </div>
                    </div>
                  </div>

                  {/* Context Snippet with HTML Highlights */}
                  <div 
                    style={{
                      padding: '0.85rem 1rem',
                      backgroundColor: '#0b1329',
                      borderRadius: '6px',
                      border: '1px solid #334155',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#e2e8f0',
                      marginBottom: '0.75rem',
                      lineHeight: '1.6'
                    }}
                    dangerouslySetInnerHTML={{ __html: res.snippet }}
                  />

                  {/* Footer Meta & Open Document Button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <div>
                      Match Position: <span style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{res.earliest_position}</span> | Mode: <span style={{ color: '#34d399' }}>{res.query_type}</span>
                    </div>

                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={() => onOpenDocumentModal(res.doc_name, searchResults.query, res)}
                    >
                      <BookOpen size={14} /> Open Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
