import { Server } from 'socket.io';

// Assuming you have an HTTP server defined above
// If not, you'll need to create one
import http from 'http';
const server = http.createServer();  // Add this if you don't have a server defined

const ioServer = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

ioServer.on('connection', (socket) => {

    // Handle incoming socket connection

    socket.on('send-changes', (delta) => {
        // console.log('Received changes:', delta);
        socket.broadcast.emit('receive-changes', delta);
    });

    socket.on('get-document', (documentId) => {

        const document = ''; // Fetch the document from your database or storage

        socket.join(documentId);

        socket.emit('load-document', document);

        socket.on('save-document', (data) => {
            socket.broadcast.to(documentId).emit('receive-changes', data);
            // Save the document to your database or storage
            console.log('Document saved:', data);
        });
    })



    console.log('A client connected');
    console.log(`Socket ID: ${socket.id}`);

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Make sure to listen on a port
server.listen(3001, () => {
    console.log('Server running on port 3001');
});