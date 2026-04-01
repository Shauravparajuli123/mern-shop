import { useState } from 'react';
import { validatePromoCode } from '../utils/dfaValidator';

// Valid promo codes database
const VALID_CODES = {
  SAVE10: 10,
  OFF20:  20,
  DEAL50: 50,
  NEW15:  15,
};

const PromoCode = ({ onApply }) => {
  const [code, setCode]         = useState('');
  const [result, setResult]     = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked]   = useState(false);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setCode(val);
    // Live DFA format validation
    setResult(validatePromoCode(val));
  };

  const handleApply = () => {
    // Fraud detection — block after 5 failed attempts
    if (blocked) {
      setResult({ valid: false,
        message: '🚫 Too many attempts. Please wait.' });
      return;
    }

    const formatCheck = validatePromoCode(code);
    if (!formatCheck.valid) {
      setResult(formatCheck);
      return;
    }

    // Check against valid codes
    const discount = VALID_CODES[code];
    if (discount) {
      setResult({ valid: true,
        message: `✅ Code applied! ${discount}% discount` });
      setAttempts(0);
      onApply(discount);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setBlocked(true);
        setResult({ valid: false,
          message: '🚫 Too many failed attempts. Blocked for security.' });
      } else {
        setResult({ valid: false,
          message: `❌ Invalid code. ${5 - newAttempts} attempts remaining.` });
      }
    }
  };

  return (
    <div style={{ marginTop: 20, padding: 16,
      background: '#f9f9f9', borderRadius: 8,
      border: '1px solid #eee' }}>
      <p style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>
        Promo Code
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={code}
          onChange={handleChange}
          placeholder="e.g. SAVE10"
          maxLength={8}
          disabled={blocked}
          style={{ flex: 1, padding: '8px 12px', borderRadius: 6,
            border: `2px solid ${
              !result ? '#ddd' :
              result.valid ? '#00cc44' : '#ff4d4d'
            }`,
            fontSize: 14, textTransform: 'uppercase',
          }}
        />
        <button onClick={handleApply} disabled={blocked}
          style={{ padding: '8px 16px', background: blocked ? '#aaa' : '#1a1a2e',
            color: '#fff', border: 'none', borderRadius: 6,
            cursor: blocked ? 'not-allowed' : 'pointer' }}>
          Apply
        </button>
      </div>

      {result && (
        <p style={{ fontSize: 13, marginTop: 6,
          color: result.valid ? 'green' : '#ff4d4d' }}>
          {result.message}
        </p>
      )}

      {attempts > 0 && !blocked && (
        <p style={{ fontSize: 12, color: '#ff944d', marginTop: 4 }}>
          ⚠️ Failed attempts: {attempts}/5
        </p>
      )}

      <p style={{ fontSize: 11, color: '#aaa', marginTop: 8 }}>
        DFA states: q0 (start) → q1 (letters) → q2 (digits) → accept/reject
      </p>
    </div>
  );
};

export default PromoCode;