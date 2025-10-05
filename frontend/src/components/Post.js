import React, { useState, useContext } from 'react';
import api from '../services/api';
import LikeButton from './LikeButton';
import Comment from './Comment';
import { AuthContext } from '../context/AuthContext';
import { FaCommentDots, FaTimes } from 'react-icons/fa';
import '../App.css';

const Post = ({ post, refreshPosts }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

const isAuthor = user && post.user && String(user._id) === String(post.user._id);


  const handleUpdate = async () => {
    if (!content.trim()) return alert('Content cannot be empty');
    setLoading(true);
    try {
      await api.put(`/posts/${post._id}`, { content });
      setIsEditing(false);
      refreshPosts();
    } catch {
      alert('Failed to update post');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setLoading(true);
    try {
      await api.delete(`/posts/${post._id}`);
      refreshPosts();
    } catch {
      alert('Failed to delete post');
    }
    setLoading(false);
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <strong>{post.user?.username || 'Unknown User'}</strong>
        <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
      </div>

      {isEditing ? (
        <>
          <textarea
            className="post-textarea"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
          <div className="post-actions-inline">
            <button onClick={handleUpdate} disabled={loading} className="btn save-btn">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setContent(post.content);
              }}
              disabled={loading}
              className="btn cancel-btn"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      <div className="post-actions">
        <LikeButton post={post} refreshPosts={refreshPosts} />
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="comment-toggle-btn"
          aria-label="Toggle comments"
        >
          <FaCommentDots size={18} /> {post.comments.length}
        </button>

        {isAuthor && !isEditing && (
          <>
            <button onClick={() => setIsEditing(true)} className="btn edit-btn">
              Edit
            </button>
            <button onClick={handleDelete} disabled={loading} className="btn delete-btn">
              Delete
            </button>
          </>
        )}
      </div>

      {showComments && (
        <div className="comment-section">
          <button
            className="comment-close-btn"
            onClick={() => setShowComments(false)}
            aria-label="Close comments"
          >
            <FaTimes size={20} />
          </button>

          <Comment post={post} refreshPosts={refreshPosts} />
        </div>
      )}
    </div>
  );
};

export default Post;
