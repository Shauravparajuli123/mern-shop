import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  validateName, validateEmail,
  validatePassword, getStrengthColor
} from '../utils/dfaValidator';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // DFA fires on every keystroke
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Run DFA validation live
    const validators = {
      name:     validateName,
      email:    validateEmail,
      password: validatePassword,
    };
    const result = validators[name](value);
    setErrors((prev) => ({ ...prev, [name]: result }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameV  = validateName(form.name);
    const emailV = validateEmail(form.email);
    const passV  = validatePassword(form.password);

    setErrors({ name: nameV, email: emailV, password: passV });
    if (!nameV.valid || !emailV.valid || !passV.valid) return;

    try {
      const { data } = await axios.post('/api/users/register', form);
      login(data);
      navigate('/');
    } catch {
      setServerError('Registration failed. Email may already be in use.');
    }
  };

  const fieldStyle = (fieldName) => ({
    padding: 10, borderRadius: 6, fontSize: 14, width: '100%',
    border: `2px solid ${
      !errors[fieldName] ? '#ddd' :
      errors[fieldName].valid ? '#00cc44' : '#ff4d4d'
    }`,
    outline: 'none', boxSizing: 'border-box',
  });

  const passwordStrength = errors.password?.strength || 0;

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 28,
      border: '1px solid #eee', borderRadius: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#1a1a2e', marginBottom: 6 }}>Create Account</h2>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
        Live validation powered by DFA
      </p>

      {serverError && (
        <p style={{ color: 'red', background: '#fff0f0',
          padding: '8px 12px', borderRadius: 6, fontSize: 13 }}>
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Name field */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600,
            color: '#444', display: 'block', marginBottom: 4 }}>
            Full Name
          </label>
          <input name="name" value={form.name}
            onChange={handleChange} placeholder="John Doe"
            style={fieldStyle('name')} />
          {errors.name && (
            <p style={{ fontSize: 12, margin: '4px 0 0',
              color: errors.name.valid ? 'green' : '#ff4d4d' }}>
              {errors.name.message}
              <span style={{ color: '#aaa', marginLeft: 8 }}>
                state: {errors.name.state}
              </span>
            </p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600,
            color: '#444', display: 'block', marginBottom: 4 }}>
            Email
          </label>
          <input name="email" type="email" value={form.email}
            onChange={handleChange} placeholder="john@example.com"
            style={fieldStyle('email')} />
          {errors.email && (
            <p style={{ fontSize: 12, margin: '4px 0 0',
              color: errors.email.valid ? 'green' : '#ff4d4d' }}>
              {errors.email.message}
              <span style={{ color: '#aaa', marginLeft: 8 }}>
                state: {errors.email.state}
              </span>
            </p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600,
            color: '#444', display: 'block', marginBottom: 4 }}>
            Password
          </label>
          <input name="password" type="password" value={form.password}
            onChange={handleChange} placeholder="Min 6 chars, 1 uppercase, 1 number"
            style={fieldStyle('password')} />

          {/* Strength bar */}
          {form.password && (
            <div style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map((i) => (
                  <div key={i} style={{
                    height: 4, flex: 1, borderRadius: 2,
                    background: i <= passwordStrength
                      ? getStrengthColor(passwordStrength) : '#eee',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <p style={{ fontSize: 12, margin: '4px 0 0',
                color: errors.password?.valid ? 'green' : '#ff4d4d' }}>
                {errors.password?.message}
                <span style={{ color: '#aaa', marginLeft: 8 }}>
                  state: {errors.password?.state}
                </span>
              </p>
            </div>
          )}
        </div>

        <button type="submit"
          style={{ padding: 12, background: '#e94560', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            fontSize: 15, fontWeight: 600, marginTop: 4 }}>
          Create Account
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;