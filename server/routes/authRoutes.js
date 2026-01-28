import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    ],
    validateRequest,
    registerUser
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').exists().withMessage('Password is required'),
    ],
    validateRequest,
    loginUser
);

router.post('/logout', logoutUser);
router.post('/refresh', refreshToken);

export default router;
