import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import Post from '../components/Post';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch {
      alert('Failed to fetch posts');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  if (!token) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Please login to view the dashboard.</p>;
  }

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <Post key={post._id} post={post} refreshPosts={fetchPosts} />
        ))
      )}
    </div>
  );
};

export default Dashboard;
