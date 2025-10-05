// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token'); // token from URL
  const email = searchParams.get('email'); // optionally get email from URL query

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        email,
        token,
        newPassword,
      });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  if (!token) {
    return <p>Invalid or missing reset token.</p>;
  }

  return (
   <div className="auth-container">
  <h2>Reset Password</h2>

  {message && <p className="message success">{message}</p>}
  {error && <p className="message error">{error}</p>}

  <form onSubmit={handleSubmit} className="auth-form">
    <input
      type="password"
      placeholder="New password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required
      className="auth-input"
    />
    <input
      type="password"
      placeholder="Confirm new password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
      className="auth-input"
    />
    <button type="submit" className="auth-button">
      Reset Password
    </button>
  </form>
</div>

  );
};

export default ResetPassword;
