import { useState } from 'react';
import axios from 'axios';

const SmartSearch = ({ onResults }) => {
  const [query, setQuery]     = useState('');
  const [mode, setMode]       = useState('keyword');
  const [loading, setLoading] = useState(false);
  const [hint, setHint]       = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const param = mode === 'pattern' ? 'pattern' : 'keyword';
      const { data } = await axios.get(`/api/products?${param}=${query}`);
      onResults(data, query);
      setHint(`Found ${data.length} result(s) for "${query}"`);
    } catch {
      setHint('Search failed. Please try again.');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setQuery('');
    setHint('');
    const { data } = await axios.get('/api/products');
    onResults(data, '');
  };

  return (
    <div style={{ width: '100%' }}>

      {/* Mode toggle */}
      <div style={{ display: 'flex', justifyContent: 'center',
        gap: 8, marginBottom: 14 }}>
        {['keyword', 'pattern'].map((m) => (
          <button key={m}
            onClick={() => { setMode(m); setHint(''); }}
            style={{
              padding: '6px 18px', borderRadius: 20, border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
              background: mode === m
                ? 'rgba(255,255,255,0.25)'
                : 'rgba(255,255,255,0.08)',
              color: mode === m ? '#fff' : 'rgba(255,255,255,0.6)',
              border: mode === m
                ? '1px solid rgba(255,255,255,0.5)'
                : '1px solid rgba(255,255,255,0.15)',
            }}>
            {m === 'keyword' ? '🔤 Keyword' : '🔬 Pattern (DFA)'}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch}
        style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'pattern'
            ? 'Try patterns: *shoes* or red*|blue*'
            : 'Search for products...'}
          style={{
            flex: 1, padding: '14px 20px',
            borderRadius: 14, border: 'none',
            fontSize: 15, outline: 'none',
            background: 'rgba(255,255,255,0.95)',
            color: '#1a1a2e', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        />

        {/* Search button */}
        <button type="submit" disabled={loading}
          style={{
            padding: '14px 28px', borderRadius: 14, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap',
            background: loading
              ? 'rgba(255,255,255,0.4)'
              : 'linear-gradient(135deg, #e94560, #f5a623)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(233,69,96,0.5)',
            transition: 'all 0.2s',
          }}>
          {loading ? '...' : '🔍 Search'}
        </button>

        {/* Reset button — only shows when there's a query */}
        {query && (
          <button type="button" onClick={handleReset}
            style={{
              padding: '14px 20px', borderRadius: 14,
              border: '2px solid rgba(255,255,255,0.4)',
              background: 'transparent', color: '#fff',
              cursor: 'pointer', fontWeight: 600, fontSize: 14,
            }}>
            ✕ Clear
          </button>
        )}
      </form>

      {/* Hint text */}
      {hint && (
        <p style={{
          textAlign: 'center', marginTop: 10, fontSize: 13,
          color: hint.includes('Found') ? '#a8ffb0' : '#ffb3b3',
        }}>
          {hint}
        </p>
      )}

      {/* Pattern guide */}
      {mode === 'pattern' && (
        <div style={{
          marginTop: 10, padding: '8px 16px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 10, fontSize: 12,
          color: 'rgba(255,255,255,0.8)', textAlign: 'center',
        }}>
          <code style={{ background: 'rgba(255,255,255,0.15)',
            padding: '1px 6px', borderRadius: 4 }}>*</code>
          {' '}= any chars &nbsp;|&nbsp;
          <code style={{ background: 'rgba(255,255,255,0.15)',
            padding: '1px 6px', borderRadius: 4 }}>|</code>
          {' '}= OR &nbsp;|&nbsp; Example:{' '}
          <code style={{ background: 'rgba(255,255,255,0.15)',
            padding: '1px 6px', borderRadius: 4 }}>*phone*|*laptop*</code>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;