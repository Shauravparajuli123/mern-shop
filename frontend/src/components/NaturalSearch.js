import { useState } from 'react';
import { parseCFG, applyParsedQuery } from '../utils/cfgParser';

const NaturalSearch = ({ products, onResults }) => {
  const [query, setQuery]         = useState('');
  const [parseTree, setParseTree] = useState([]);
  const [parsed, setParsed]       = useState(null);
  const [showTree, setShowTree]   = useState(false);

  const examples = [
    'Show me red shirts under $50',
    'Find blue shoes',
    'Get phones under $500',
    'Show black bags over $20',
    'Find green pants under $80',
  ];

  const handleSearch = (q) => {
    const input = q || query;
    if (!input.trim()) return;

    const result = parseCFG(input);
    setParsed(result);
    setParseTree(result?.parseTree || []);
    setShowTree(true);

    const filtered = applyParsedQuery(products, result);
    onResults(filtered, input);
  };

  const typeColors = {
    Action:   { bg: '#e8f4fd', color: '#1565c0' },
    Color:    { bg: '#fce4ec', color: '#880e4f' },
    Category: { bg: '#e8f5e9', color: '#1b5e20' },
    PriceOp:  { bg: '#fff3e0', color: '#e65100' },
    Price:    { bg: '#f3e5f5', color: '#4a148c' },
  };

  return (
    <div style={{ marginBottom: 24, padding: 20,
      background: '#fafafa', borderRadius: 10,
      border: '1px solid #e0e0e0' }}>

      <div style={{ display: 'flex', alignItems: 'center',
        gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>🧠</span>
        <strong style={{ color: '#1a1a2e' }}>
          Natural Language Search (CFG Parser)
        </strong>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder='Try: "Show me red shirts under $50"'
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8,
            border: '2px solid #1a1a2e', fontSize: 14 }}
        />
        <button onClick={() => handleSearch()}
          style={{ padding: '10px 20px', background: '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: 8,
            cursor: 'pointer', fontWeight: 600 }}>
          Parse
        </button>
      </div>

      {/* Example queries */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {examples.map((ex) => (
          <span key={ex}
            onClick={() => { setQuery(ex); handleSearch(ex); }}
            style={{ fontSize: 12, padding: '4px 10px',
              background: '#fff', borderRadius: 12,
              border: '1px solid #ddd', cursor: 'pointer',
              color: '#555', whiteSpace: 'nowrap' }}>
            {ex}
          </span>
        ))}
      </div>

      {/* Parse Tree Visualization */}
      {showTree && parseTree.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 600,
            color: '#555', marginBottom: 8 }}>
            Parse Tree:
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {parseTree.map((node, i) => (
              <div key={i} style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 12,
                background: typeColors[node.type]?.bg || '#eee',
                color: typeColors[node.type]?.color || '#333',
                border: `1px solid ${typeColors[node.type]?.color || '#ccc'}22`,
              }}>
                <span style={{ fontWeight: 700 }}>{node.type}</span>
                <br />
                <span>{node.value}</span>
              </div>
            ))}
          </div>

          {/* Extracted filters summary */}
          {parsed && (
            <div style={{ marginTop: 10, padding: '8px 12px',
              background: '#fff', borderRadius: 6,
              border: '1px solid #eee', fontSize: 13 }}>
              <strong>Extracted filters:</strong> &nbsp;
              {parsed.colors.length > 0 && <span>Color: <b>{parsed.colors.join(', ')}</b> &nbsp;</span>}
              {parsed.category && <span>Category: <b>{parsed.category}</b> &nbsp;</span>}
              {parsed.price !== null && (
                <span>Price: <b>{parsed.operator} ${parsed.price}</b></span>
              )}
              {!parsed.colors.length && !parsed.category && parsed.price === null && (
                <span style={{ color: '#aaa' }}>No filters detected</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NaturalSearch;