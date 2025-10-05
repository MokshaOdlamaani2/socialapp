const express = require('express');
const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getMyPosts,
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');

// ✅ Protect all routes
router.use(protect);

/**
 * ✅ Define static routes BEFORE dynamic `/:id` route
 */

// ✅ Must come first
router.get('/mine', getMyPosts);

// Main post routes
router.route('/')
  .post(createPost)
  .get(getPosts);

// ✅ Like and Comment routes
router.post('/:id/like', toggleLike);
router.post('/:id/comment', addComment);

// ❗️This must come LAST to avoid conflict with `/mine`
router.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

module.exports = router;
