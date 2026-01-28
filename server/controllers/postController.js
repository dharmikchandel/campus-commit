import Post from '../models/Post.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res, next) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'username');
        if (post) {
            res.json(post);
        } else {
            res.status(404);
            throw new Error('Post not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (Admin/Editor)
export const createPost = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;

        // Simple slug generator
        // Robust slug generator with uniqueness
        let slug = title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');

        // Append random string to ensure uniqueness and avoid collision errors
        slug = `${slug}-${Date.now().toString(36)}`;

        // We can skip the strict "exists" check because the timestamp ensures uniqueness practically
        // But for double safety in high-traffic (unlikely here), we could loop. 
        // For this project, timestamp is sufficient.

        const post = await Post.create({
            title,
            slug,
            content,
            tags,
            author: req.user._id,
        });

        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Admin or Editor(Owner))
export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        // Check ownership or admin
        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to update this post');
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        post.tags = req.body.tags || post.tags;

        if (req.body.title) {
            post.slug = req.body.title
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Admin or Editor(Owner))
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(403);
            throw new Error('Not authorized to delete this post');
        }

        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        next(error);
    }
};
