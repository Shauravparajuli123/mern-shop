import { useState } from 'react';
import axios from 'axios';

const SmartSearch = ({ onResults }) => {
  const [query, setQuery]     = useState('');
  const [mode, setMode]       = useState('keyword'); // keyword | pattern
  const [loading, setLoading] = useState(false);
  const [hint, setHint]       = useState('');

  const examples = {
    keyword: ['shoes', 'red shirt', 'laptop'],
    pattern: ['*shoes*', 'red*|blue*', 'shirt|pants', '*under*50*'],
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const param = mode === 'pattern' ? 'pattern' : 'keyword';
      const { data } = await axios.get(`/api/products?${param}=${query}`);
      onResults(data, query);
      setHint(`Found ${data.length} product(s) matching "${query}"`);
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
    <div style={{ marginBottom: 28 }}>
      {/* Search mode toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['keyword', 'pattern'].map((m) => (
          <button key={m} onClick={() => { setMode(m); setHint(''); }}
            style={{ padding: '6px 16px', borderRadius: 20, border: 'none',
              cursor: 'pointer', fontSize: 13,
              background: mode === m ? '#1a1a2e' : '#eee',
              color: mode === m ? '#fff' : '#333' }}>
            {m === 'keyword' ? 'Keyword Search' : 'Pattern Search (DFA)'}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch}
        style={{ display: 'flex', gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'pattern'
            ? 'Try: *shoes* or red*|blue*'
            : 'Search products...'}
          style={{ flex: 1, padding: '10px 16px', borderRadius: 8,
            border: '2px solid #1a1a2e', fontSize: 14 }}
        />
        <button type="submit" disabled={loading}
          style={{ padding: '10px 20px', background: '#e94560',
            color: '#fff', border: 'none', borderRadius: 8,
            cursor: 'pointer', fontWeight: 600 }}>
          {loading ? '...' : 'Search'}
        </button>
        {query && (
          <button type="button" onClick={handleReset}
            style={{ padding: '10px 16px', background: '#eee',
              border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Reset
          </button>
        )}
      </form>

      {/* Example patterns */}
      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#888' }}>Try:</span>
        {examples[mode].map((ex) => (
          <span key={ex} onClick={() => setQuery(ex)}
            style={{ fontSize: 12, color: '#e94560', cursor: 'pointer',
              padding: '2px 8px', background: '#fff0f3',
              borderRadius: 10, border: '1px solid #f5c6ce' }}>
            {ex}
          </span>
        ))}
      </div>

      {/* Result hint */}
      {hint && (
        <p style={{ marginTop: 8, fontSize: 13,
          color: hint.includes('Found') ? 'green' : 'red' }}>
          {hint}
        </p>
      )}

      {/* DFA explanation for pattern mode */}
      {mode === 'pattern' && (
        <div style={{ marginTop: 10, padding: '10px 14px',
          background: '#f0f4ff', borderRadius: 8,
          border: '1px solid #c7d4f5', fontSize: 13, color: '#444' }}>
          <strong>DFA Pattern Guide:</strong> &nbsp;
          <code>*</code> = any characters &nbsp;|&nbsp;
          <code>?</code> = one character &nbsp;|&nbsp;
          <code>|</code> = OR (NFA parallel match) &nbsp;|&nbsp;
          Example: <code>red*|*blue*</code> finds red OR blue products
        </div>
      )}
    </div>
  );
};

export default SmartSearch;