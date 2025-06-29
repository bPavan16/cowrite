import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
import connectToDb from './config/db.js';
import { findOrCreateDocument, saveDocument } from './utils/db.utils.js';
import documentRoutes from './routes/document.routes.js';
import authRoutes from './routes/auth.routes.js';
import { socketAuth } from './middleware/socket.middleware.js';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);

// Create HTTP server with Express
const server = http.createServer(app);

// Ensure the database connection is established
connectToDb();

const ioServer = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5175'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }
});

// Apply socket authentication middleware
ioServer.use(socketAuth);

ioServer.on('connection', (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on('get-document', async (documentId, title) => {
        try {
            // Fetch the document from your database or storage
            const document = await findOrCreateDocument(documentId, title, socket.user);

            // console.log('Client connected with document ID:', documentId);
            socket.join(documentId);

            socket.emit('load-document', document);

            socket.on('send-changes', (delta) => {
                socket.broadcast.to(documentId).emit('receive-changes', delta);
                console.log('Changes broadcast to room:', documentId);
            });

            socket.on('update-title', async (newTitle) => {
                try {
                    // Update just the title
                    await saveDocument(documentId, null, newTitle, socket.user);
                    // Broadcast title change to other users
                    socket.broadcast.to(documentId).emit('title-updated', newTitle);
                    console.log('Title updated:', newTitle);
                } catch (error) {
                    console.error('Error updating title:', error);
                    socket.emit('error', { message: 'Error updating title: ' + error.message });
                }
            });

            socket.on('save-document', async (data) => {
                try {
                    // Save document content and title if provided
                    await saveDocument(documentId, data.data, data.title, socket.user);
                    // console.log('Document saved successfully');
                } catch (error) {
                    console.error('Error saving document:', error);
                    socket.emit('error', { message: 'Error saving document: ' + error.message });
                }
            });

            // Chat functionality
            socket.on('send-chat-message', (messageData) => {
                try {
                    const message = {
                        id: `${socket.user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        text: messageData.text,
                        userId: socket.user.id,
                        username: socket.user.username,
                        firstName: socket.user.firstName,
                        lastName: socket.user.lastName,
                        timestamp: new Date().toISOString()
                    };
                    
                    // Send the message back to the sender for immediate display
                    socket.emit('receive-chat-message', message);
                    
                    // Broadcast the message to other users in the document room (excluding sender)
                    socket.broadcast.to(documentId).emit('receive-chat-message', message);
                    console.log(`Chat message sent in document ${documentId} by ${socket.user.username}`);
                } catch (error) {
                    console.error('Error handling chat message:', error);
                    socket.emit('error', { message: 'Error sending chat message: ' + error.message });
                }
            });

            socket.on('user-typing', (isTyping) => {
                try {
                    const typingData = {
                        userId: socket.user.id,
                        username: socket.user.username,
                        isTyping: isTyping
                    };
                    
                    // Broadcast typing status to other users in the room
                    socket.broadcast.to(documentId).emit('user-typing-status', typingData);
                } catch (error) {
                    console.error('Error handling typing status:', error);
                }
            });
        } catch (error) {
            console.error('Error handling document:', error);
            socket.emit('error', { message: 'Error loading document: ' + error.message });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
    });
});

// Make sure to listen on a port
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});