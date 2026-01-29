import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
export const updateUserRole = async (req, res, next) => {
    console.log('updateUserRole called with body:', req.body);
    try {
        const { role } = req.body;
        
        if (role !== 'reader' && role !== 'editor' && role !== 'admin') {
            res.status(400);
            throw new Error('Invalid role');
        }
        // const user = await User.findById(req.params.id);
        
        // if (!user) {
        //     res.status(404);
        //     throw new Error('User not found');
        // }


        // user.role = role;
        // const updatedUser = await user.save();

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            {
                new: true,           // return updated document
                runValidators: true, // enforce schema validation
            }
        );

        if (!updatedUser) {
            res.status(404);
            throw new Error('User not found');
        }


        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        next(error);
    }
};
