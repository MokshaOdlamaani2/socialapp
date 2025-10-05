import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../App.css'; 

const Navbar = () => {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>SocialApp</h1>
      <div style={styles.linksContainer}>
        {token ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/create-post" className="nav-link">Create Post</Link>
            <span style={styles.welcome}>Hi, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '12px 30px',
    background: 'linear-gradient(70deg, #6664d1 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logo: {
    color: '#fff',
    fontWeight: '900',
    fontSize: '1.8rem',
    letterSpacing: '2px',
    cursor: 'pointer',
    userSelect: 'none',
    textShadow: '1px 1px 5px rgba(0,0,0,0.4)',
  },
  linksContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  welcome: {
    color: '#fff',
    fontWeight: '500',
    marginRight: '20px',
    fontSize: '1rem',
    fontStyle: 'italic',
    userSelect: 'none',
  },
};

export default Navbar;
