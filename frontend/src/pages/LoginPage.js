import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      login(data);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 24, padding: '48px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{
            fontSize: 32, fontWeight: 900, margin: '0 0 8px',
            background: 'linear-gradient(135deg, #302b63, #e94560)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#888', fontSize: 14, margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f3', border: '1px solid #ffccd5',
            borderRadius: 10, padding: '12px 16px',
            color: '#e94560', fontSize: 13, marginBottom: 20,
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600,
              color: '#444', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com" required
              style={{ width: '100%', padding: '12px 16px',
                borderRadius: 10, border: '2px solid #eee',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => e.target.style.border = '2px solid #302b63'}
              onBlur={(e) => e.target.style.border = '2px solid #eee'}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600,
              color: '#444', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" required
              style={{ width: '100%', padding: '12px 16px',
                borderRadius: 10, border: '2px solid #eee',
                fontSize: 14, outline: 'none', boxSizing: 'border-box',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => e.target.style.border = '2px solid #302b63'}
              onBlur={(e) => e.target.style.border = '2px solid #eee'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            padding: '14px 0', border: 'none', borderRadius: 12,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 800, fontSize: 16, marginTop: 8,
            background: loading
              ? '#ccc'
              : 'linear-gradient(135deg, #e94560, #f5a623)',
            color: '#fff',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(233,69,96,0.4)',
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24,
          fontSize: 14, color: '#888' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{
            color: '#e94560', fontWeight: 700, textDecoration: 'none',
          }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;