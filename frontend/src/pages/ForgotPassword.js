import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  // Countdown for resend cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Step 1: Send or resend reset code (OTP)
  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setCodeSent(true);
      setMessage(res.data.message || 'Reset code sent.');
      setCooldown(30);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify reset code (OTP)
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!/^\d{6}$/.test(code)) {
      setError('Reset code must be a 6-digit number.');
      return;
    }

    if (!email) {
      setError('Email is missing.');
      return;
    }

    const payload = { email, code };
    console.log('Verifying with payload:', payload);  // <-- Debug logging

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-reset-code', payload);
      console.log('Verify response:', res.data);       // <-- Debug logging
      navigate(`/reset-password?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Verify code error:', err.response?.data || err.message);
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
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
            disabled={loading || cooldown > 0}
            style={{ marginTop: '10px', backgroundColor: '#eee', color: '#333' }}
          >
            {cooldown > 0 ? `Resend Code (${cooldown}s)` : 'Resend Code'}
          </button>
        </section>
      )}
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
