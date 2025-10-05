import React, { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import '../App.css';

const LikeButton = ({ post, refreshPosts }) => {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [loading, setLoading] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      setLiked(post.likes.includes(userId));
    } else {
      setLiked(false);
    }
  }, [post.likes, user]);

  const handleLike = async () => {
    if (!user) return alert('Login to like posts');
    setLoading(true);
    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setLikesCount(res.data.likesCount);
      setLiked(res.data.likedByUser);

      if (!liked) {
        setShowHeartPop(true);
        setTimeout(() => setShowHeartPop(false), 700);
      }

      if (refreshPosts) refreshPosts();
    } catch {
      alert('Failed to like post');
    }
    setLoading(false);
  };

  return (
    <div className="like-container">
      <button
        className={`like-button ${liked ? 'liked' : ''}`}
        onClick={handleLike}
        disabled={loading}
        aria-label={liked ? 'Unlike post' : 'Like post'}
      >
        {liked ? <FaHeart className="icon" /> : <FaRegHeart className="icon" />}
        <span className="like-count">{likesCount}</span>
      </button>

      {showHeartPop && <div className="heart-pop">💖</div>}
    </div>
  );
};

export default LikeButton;
