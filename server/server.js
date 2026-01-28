import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import sanitize from 'mongo-sanitize';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});

app.set('io', io);

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinPost', (postId) => {
        socket.join(postId);
        console.log(`Socket ${socket.id} joined post room: ${postId}`);
    });

    socket.on('leavePost', (postId) => {
        socket.leave(postId);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));

console.log('CLIENT_URL:', process.env.CLIENT_URL);

// Security Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body Parser
app.use(express.json());
app.use(cookieParser());

// Sanitize request data (NoSQL injection prevention)
app.use((req, res, next) => {
    req.body = sanitize(req.body);
    req.params = sanitize(req.params);
    next();
});

// Rate Limiting for Auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
