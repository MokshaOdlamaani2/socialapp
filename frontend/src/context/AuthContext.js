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
        console.log('Decoded token:', decoded); // Inspect this in console

        // Some tokens have user info directly, some nested under 'user'
        const userData = decoded.user || decoded;

        // Normalize user id field to _id if necessary
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

  // Updated login to accept email and password
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const receivedToken = res.data.token;
    localStorage.setItem('token', receivedToken);

    let userData = res.data.user;

    // Normalize _id field
    if (userData && !userData._id && userData.id) {
      userData._id = userData.id;
    }

    setToken(receivedToken);
    setUser(userData);

    return res.data;
  };

  const register = async (email, username, password) => {
    const res = await api.post('/auth/register', { email, username, password });
    const receivedToken = res.data.token;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);

    let userData = res.data.user;

    // Normalize _id field if present
    if (userData && !userData._id && userData.id) {
      userData._id = userData.id;
    }
    
    setUser(userData);
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
