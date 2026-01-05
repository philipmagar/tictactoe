import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  
  // Register State
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [error, setError] = useState('');

  const validateInput = (username, password) => {
    if (!username.trim() || !password.trim()) {
      setError('Username and password cannot be blank');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateInput(regUsername, regPassword)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: regUsername, password: regPassword })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || res.statusText);
      }
      alert('Registration successful! Please login.');
      setIsRegister(false);
      setRegUsername('');
      setRegPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateInput(loginUsername, loginPassword)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || res.statusText);
      }
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    outline: 'none',
    fontSize: '1rem'
  };

  const btnStyle = {
    padding: '12px 0',
    width: '100%',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(90deg, #bb86fc, #03dac6)',
    color: '#000',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'transform 0.1s'
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start',
      marginTop: '20px',
      minHeight: '100vh', 
      flexDirection: 'column' 
    }}>
      <div style={{ 
        padding: '1rem', 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center' 
        // Removed background, box-shadow, border to blend in
      }}>
        {isRegister ? (
          <form onSubmit={handleRegister}>
            <h1 style={{ color: '#fff', marginBottom: '2rem' }}>Create Account</h1>
            <input 
              type="text" 
              placeholder="Username" 
              value={regUsername} 
              onChange={e => setRegUsername(e.target.value)} 
              style={inputStyle}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={regPassword} 
              onChange={e => setRegPassword(e.target.value)} 
              style={inputStyle}
            />
            {error && <p className="error-text" style={{ color: '#cf6679', marginTop: '10px' }}>{error}</p>}
            <button type="submit" style={btnStyle}>SIGN UP</button>
            <p style={{ color: '#a0a0a0', marginTop: '20px', fontSize: '0.9rem' }}>
              Already have an account? <span style={{ color: '#bb86fc', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setIsRegister(false); setError(''); }}>Sign In</span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h1 style={{ color: '#fff', marginBottom: '2rem' }}>Welcome Back</h1>
            <input 
              type="text" 
              placeholder="Username" 
              value={loginUsername} 
              onChange={e => setLoginUsername(e.target.value)} 
              style={inputStyle}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginPassword} 
              onChange={e => setLoginPassword(e.target.value)} 
              style={inputStyle}
            />
            {error && <p className="error-text" style={{ color: '#cf6679', marginTop: '10px' }}>{error}</p>}
            <button type="submit" style={btnStyle}>SIGN IN</button>
            <p style={{ color: '#a0a0a0', marginTop: '20px', fontSize: '0.9rem' }}>
              Don't have an account? <span style={{ color: '#bb86fc', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { setIsRegister(true); setError(''); }}>Sign Up</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
