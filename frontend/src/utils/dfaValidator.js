// Each validator is a DFA defined as states + transitions
// Returns { valid, message, state }

// Email DFA
export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) return { valid: false, message: 'Email is required', state: 'q0' };
  if (!email.includes('@')) return { valid: false, message: 'Missing @ symbol', state: 'q1' };
  if (!email.includes('.')) return { valid: false, message: 'Missing domain extension', state: 'q2' };
  if (regex.test(email)) return { valid: true,  message: '✓ Valid email', state: 'accept' };
  return { valid: false, message: 'Invalid email format', state: 'reject' };
};

// Password DFA — checks rules one by one like DFA states
export const validatePassword = (password) => {
  if (!password)          return { valid: false, message: 'Password required',           state: 'q0', strength: 0 };
  if (password.length < 6) return { valid: false, message: 'Min 6 characters',           state: 'q1', strength: 1 };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Need one uppercase letter', state: 'q2', strength: 2 };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Need one number',           state: 'q3', strength: 3 };
  if (!/[!@#$%^&*]/.test(password)) return { valid: true, message: '✓ Good password',      state: 'accept', strength: 4 };
  return { valid: true, message: '✓ Strong password!', state: 'accept', strength: 5 };
};

// Phone DFA
export const validatePhone = (phone) => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (!phone)                     return { valid: false, message: 'Phone required',          state: 'q0' };
  if (!/^\d+$/.test(cleaned))     return { valid: false, message: 'Only digits allowed',     state: 'q1' };
  if (cleaned.length < 10)        return { valid: false, message: 'Too short (min 10 digits)', state: 'q2' };
  if (cleaned.length > 15)        return { valid: false, message: 'Too long (max 15 digits)', state: 'q3' };
  return { valid: true, message: '✓ Valid phone number', state: 'accept' };
};

// Name DFA
export const validateName = (name) => {
  if (!name || name.trim() === '') return { valid: false, message: 'Name is required',     state: 'q0' };
  if (name.trim().length < 2)      return { valid: false, message: 'Name too short',       state: 'q1' };
  if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, message: 'Letters only please', state: 'q2' };
  return { valid: true, message: '✓ Valid name', state: 'accept' };
};

// Promo code DFA — valid format: 2-4 letters + 2-4 digits (e.g. SAVE50, OFF20)
export const validatePromoCode = (code) => {
  if (!code)                                       return { valid: false, message: 'Enter a promo code',      state: 'q0' };
  if (!/^[A-Z]{2,4}[0-9]{2,4}$/.test(code.toUpperCase())) return { valid: false, message: 'Format: LETTERS + NUMBERS (e.g. SAVE50)', state: 'q1' };
  return { valid: true, message: '✓ Valid promo code format', state: 'accept' };
};

// Strength bar helper
export const getStrengthColor = (strength) => {
  const colors = ['#eee', '#ff4d4d', '#ff944d', '#ffd11a', '#85e085', '#00cc44'];
  return colors[strength] || '#eee';
};