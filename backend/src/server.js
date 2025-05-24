import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
import connectToDb from './config/db.js';
import { findOrCreateDocument, saveDocument } from './utils/db.utils.js';
import documentRoutes from './routes/document.routes.js';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/documents', documentRoutes);

// Create HTTP server with Express
const server = http.createServer(app);

// Ensure the database connection is established
connectToDb();

const ioServer = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    }
});

ioServer.on('connection', (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on('get-document', async (documentId, title) => {
        try {
            // Fetch the document from your database or storage
            const document = await findOrCreateDocument(documentId, title);

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
                    await saveDocument(documentId, null, newTitle);
                    // Broadcast title change to other users
                    socket.broadcast.to(documentId).emit('title-updated', newTitle);
                    console.log('Title updated:', newTitle);
                } catch (error) {
                    console.error('Error updating title:', error);
                }
            });

            socket.on('save-document', async (data) => {
                try {
                    // Save document content and title if provided
                    await saveDocument(documentId, data.data, data.title);
                    // console.log('Document saved successfully');
                } catch (error) {
                    console.error('Error saving document:', error);
                }
            });
        } catch (error) {
            console.error('Error handling document:', error);
            socket.emit('error', { message: 'Error loading document' });
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