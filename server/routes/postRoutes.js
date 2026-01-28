import express from 'express';
import { getPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/rbacMiddleware.js';

// Include comment router
import commentRouter from './commentRoutes.js';

const router = express.Router();

// Re-route into other resource routers
router.use('/:postId/comments', commentRouter);

router.route('/')
    .get(getPosts)
    .post(protect, authorize('admin', 'editor'), createPost);

router.route('/slug/:slug').get(getPostBySlug);

router.route('/:id')
    .put(protect, authorize('admin', 'editor'), updatePost)
    .delete(protect, authorize('admin', 'editor'), deletePost);

export default router;
