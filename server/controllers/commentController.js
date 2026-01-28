import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('user', 'username')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

// @desc    Add a comment
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = async (req, res, next) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        const comment = await Comment.create({
            text,
            post: req.params.postId,
            user: req.user._id,
        });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'username');

        // Socket.io Real-time update
        const io = req.app.get('io');
        io.to(req.params.postId).emit('new-comment', populatedComment);

        res.status(201).json(populatedComment);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Admin or Owner)
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            res.status(404);
            throw new Error('Comment not found');
        }

        if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to delete this comment');
        }

        const postId = comment.post;
        await comment.deleteOne();

        const io = req.app.get('io');
        io.to(postId.toString()).emit('delete-comment', comment._id);

        res.json({ message: 'Comment removed' });
    } catch (error) {
        next(error);
    }
};
