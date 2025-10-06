import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const userData = decoded.user || decoded;

        if (userData && !userData._id && userData.id) {
          userData._id = userData.id;
        }

        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('Invalid token:', err);
        logout();
      }
    } else {
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const receivedToken = res.data.token;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);

    let userData = res.data.user;
    if (userData && !userData._id && userData.id) {
      userData._id = userData.id;
    }
    setUser(userData);

    return res.data;
  };

  const register = async (email, username, password) => {
    const res = await api.post('/auth/register', { email, username, password });
    const receivedToken = res.data.token;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);

    let userData = res.data.user;
    if (userData && !userData._id && userData.id) {
      userData._id = userData.id;
    }
    setUser(userData);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
