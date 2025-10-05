// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Step 1: Send or Resend reset code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setCodeSent(true);
      setMessage(res.data.message || 'Reset code sent!');
    } catch (err) {
      setError('Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-reset-code', { email, token });

      // ✅ Redirect with token and email
      navigate(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {!codeSent ? (
        <section>
          <h2>Forgot Password</h2>
          <form onSubmit={handleSendCode} className="auth-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        </section>
      ) : (
        <section>
          <h2>Enter Reset Code</h2>
          <form onSubmit={handleVerifyCode} className="auth-form">
            <input
              type="text"
              placeholder="Enter 6-digit reset code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="auth-input"
            />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <button
            type="button"
            className="auth-button secondary"
            onClick={handleSendCode}
            disabled={loading}
            style={{ marginTop: '10px', backgroundColor: '#eee', color: '#333' }}
          >
            Resend Code
          </button>
        </section>
      )}

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
