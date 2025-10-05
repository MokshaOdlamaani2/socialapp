import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Comment = ({ post, refreshPosts, onClose }) => {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!user) return alert('Login to comment');
    if (!commentText.trim()) return alert('Comment cannot be empty');
    setLoading(true);
    try {
      await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setCommentText('');
      if (refreshPosts) refreshPosts();
    } catch {
      alert('Failed to add comment');
    }
    setLoading(false);
  };

  return (
    <div className="comment-box">
      {/* Close button */}
      <button
        className="comment-close-btn"
        onClick={onClose}
        aria-label="Close comments"
        title="Close comments"
      >
        &times;
      </button>

      <h4>Comments ({post.comments.length})</h4>
      <ul className="comment-list">
        {post.comments.map(comment => (
          <li key={comment._id} className="comment-item">
            <b>{comment.user?.username || 'Unknown'}:</b> {comment.text}
          </li>
        ))}
      </ul>
      <textarea
        className="comment-textarea"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows={3}
        disabled={loading}
      />
      <button
        onClick={handleAddComment}
        disabled={loading || !commentText.trim()}
        className="btn comment-btn"
      >
        Add Comment
      </button>
    </div>
  );
};

export default Comment;
