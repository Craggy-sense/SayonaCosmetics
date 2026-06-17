"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid administrator email or password.');
      } else {
        setError('An error occurred during authentication. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <img 
          src="/SayonaCosmeticsLogo.png" 
          alt="Sayona Cosmetics Logo" 
          className="login-card-logo"
          onError={(e) => { e.target.src = 'SayonaCosmeticsLogo.png'; }}
        />
        <h2>Sayona Admin Portal</h2>

        {error && (
          <div className="login-error-alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="admin_email">Email Address</label>
            <input 
              type="email" 
              id="admin_email" 
              required
              className="admin-input"
              placeholder="admin@sayonacosmetics.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="admin-form-group" style={{ textAlign: 'left' }}>
            <label htmlFor="admin_password">Password</label>
            <input 
              type="password" 
              id="admin_password" 
              required
              className="admin-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', paddingBlock: '14px', marginTop: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
