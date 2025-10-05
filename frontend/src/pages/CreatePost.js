import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Post from '../components/Post';
import '../App.css';

const CreatePost = () => {
  const { token, user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (token && user) {
      fetchPosts();
    }
  }, [token, user]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await api.get('/posts/mine');
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching my posts:', error);
      alert('Failed to fetch posts');
    }
    setPostsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return alert('Post content cannot be empty');
    }

    setLoading(true);
    try {
      const res = await api.post('/posts', { content });
      const newPost = res.data;

      if (newPost.user?._id === user._id) {
        setPosts(prev => [newPost, ...prev]);
      }

      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
    setLoading(false);
  };

  if (!token) {
    return <p className="dashboard-message">Please login to create a post.</p>;
  }

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          placeholder="What's on your mind? 🧠💬"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-textarea"
          disabled={loading}
          required
        />
        <button
          type="submit"
          className="create-post-button"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Posting...' : 'Post ✨'}
        </button>
      </form>

      <hr />

      <div className="dashboard">
        <h3>Your Posts</h3>
        {postsLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>You haven't posted anything yet.</p>
        ) : (
          posts.map(post => (
            <Post key={post._id} post={post} refreshPosts={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
};

export default CreatePost;
