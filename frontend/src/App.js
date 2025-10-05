import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './components/ResetPassword';  // Import the new ResetPassword page
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import { AuthProvider, AuthContext } from './context/AuthContext';
import bgImage from './assets/bg.jpg';

const Background = () => (
  <>
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(4px)',
        zIndex: -2,
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  </>
);

const RequireAuth = ({ children }) => {
  const { token } = React.useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Background />

        <main
          style={{
            padding: '20px',
            minHeight: 'calc(100vh - 60px)',
            position: 'relative',
            zIndex: 0,
            backgroundColor: 'transparent',
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} /> {/* New route */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/create-post"
              element={
                <RequireAuth>
                  <CreatePost />
                </RequireAuth>
              }
            />
            <Route path="*" element={<p>404: Page not found</p>} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
