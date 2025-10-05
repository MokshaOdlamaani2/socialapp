const Post = require('../models/Post');

// Create a post
const createPost = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const post = new Post({
      user: req.user._id,
      content,
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username email')
      .populate('comments.user', 'username email');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username email')
      .populate('comments.user', 'username email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error in getPosts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username email')
      .populate('comments.user', 'username email');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error in getPostById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a post (only owner)
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.content = req.body.content || post.content;
    await post.save();

    const updated = await Post.findById(post._id)
      .populate('user', 'username email')
      .populate('comments.user', 'username email');

    res.json(updated);
  } catch (error) {
    console.error('Error in updatePost:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a post (only owner)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error('Error in deletePost:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Like / unlike
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likedIndex = post.likes.findIndex(
      id => id.toString() === req.user._id.toString()
    );

    if (likedIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(likedIndex, 1);
    }

    await post.save();

    res.json({ likesCount: post.likes.length, likedByUser: likedIndex === -1 });
  } catch (error) {
    console.error('Error in toggleLike:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment
const addComment = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = { user: req.user._id, text };
    post.comments.push(comment);

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'username email')
      .populate('comments.user', 'username email');

    res.status(201).json(updatedPost);
  } catch (error) {
    console.error('Error in addComment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user's posts
const getMyPosts = async (req, res) => {
  try {
    console.log('getMyPosts called - req.user:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized - No user info' });
    }

    const posts = await Post.find({ user: req.user._id })
      .populate('user', 'username email')
      .populate('comments.user', 'username email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('🔥 Error in getMyPosts:', error);
    res.status(500).json({ message: 'Server error in getMyPosts' });
  }
};


module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getMyPosts
};
