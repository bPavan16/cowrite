import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId);

            if (user && user.isActive) {
                socket.user = user;
            }
        }
        
        // Continue regardless of authentication status (for backward compatibility)
        next();
    } catch (error) {
        console.log('Socket authentication failed:', error.message);
        // Continue without authentication
        next();
    }
};
