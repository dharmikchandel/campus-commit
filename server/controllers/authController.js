import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            res.status(400);
            throw new Error('Username already taken');
        }

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            // Generate tokens
            const accessToken = generateAccessToken(user._id, user.role);
            const refreshToken = generateRefreshToken(user._id, user.role);

            // Set Refresh Token Cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                accessToken,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateAccessToken(user._id, user.role);
            const refreshToken = generateRefreshToken(user._id, user.role);

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                accessToken,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

        const matchUser = await User.findById(decoded.userId);
        if (!matchUser) return res.status(401).json({ message: 'Found User Not Found' });

        const accessToken = generateAccessToken(matchUser._id, matchUser.role);

        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
    }
};
