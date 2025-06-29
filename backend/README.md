<div align="center">
    
# 📝 CoWrite Backend

### A powerful real-time collaboration server with authentication and chat

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)

</div>

## 🚀 Overview

The CoWrite Backend powers our real-time collaborative document editor with a robust API, WebSocket server, user authentication, and live chat functionality. It handles document storage, real-time updates, user management, and synchronization between multiple connected clients.

## ✨ Features

- **User Authentication** - JWT-based registration, login, and session management
- **Document Management** - Full CRUD operations with ownership and permissions
- **Real-time Collaboration** - WebSocket-based document synchronization
- **Live Chat System** - Real-time messaging with typing indicators
- **Document Sharing** - Advanced sharing with permission levels
- **Auto-saving** - Automatic document persistence with conflict resolution
- **Role-based Access** - User and admin roles with permission control
- **Scalable Architecture** - Designed for performance and reliability

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime environment
- **Express** - Fast, unopinionated web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security
- **Cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js               # Database connection configuration
│   ├── models/
│   │   ├── document.model.js   # Document schema and model
│   │   └── user.model.js       # User schema and model
│   ├── routes/
│   │   ├── document.routes.js  # Document REST API endpoints
│   │   └── auth.routes.js      # Authentication endpoints
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT authentication middleware
│   ├── utils/
│   │   └── db.utils.js         # Database utility functions
│   └── server.js               # Main application entry point
├── .env                        # Environment variables (create this)
├── package.json                # Dependencies and scripts
├── AUTH_API.md                 # Detailed authentication documentation
└── README.md                   # This documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local installation or Atlas connection)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cowrite.git
   cd cowrite/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/cowrite-db
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

### Running the Server

Development mode with auto-restart:

```bash
npm run dev
# or
yarn dev
```

Production mode:

```bash
npm start
# or
yarn start
```

The server will start on port 3001 (or the port specified in your `.env` file).

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint                    | Description                     | Auth Required |
| ------ | --------------------------- | ------------------------------- | ------------- |
| POST   | `/api/auth/register`        | Register a new user             | No            |
| POST   | `/api/auth/login`           | Login with credentials          | No            |
| GET    | `/api/auth/me`              | Get current user profile        | Yes           |
| PUT    | `/api/auth/profile`         | Update user profile             | Yes           |
| PUT    | `/api/auth/change-password` | Change user password            | Yes           |
| POST   | `/api/auth/logout`          | Logout user                     | Yes           |
| GET    | `/api/auth/users`           | Get all users (admin only)      | Yes (Admin)   |

### Document Endpoints

| Method | Endpoint                            | Description                    | Auth Required |
| ------ | ----------------------------------- | ------------------------------ | ------------- |
| GET    | `/api/documents`                    | Get user's accessible documents| Optional      |
| GET    | `/api/documents/:id`                | Get specific document          | Optional*     |
| POST   | `/api/documents`                    | Create a new document          | Yes           |
| PATCH  | `/api/documents/:id/title`          | Update document title          | Yes*          |
| DELETE | `/api/documents/:id`                | Delete a document              | Yes*          |
| POST   | `/api/documents/:id/collaborators`  | Add collaborator               | Yes*          |
| DELETE | `/api/documents/:id/collaborators/:userId` | Remove collaborator    | Yes*          |
| PATCH  | `/api/documents/:id/permissions`    | Update document permissions    | Yes*          |

*Requires ownership or appropriate permissions

## 📋 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b1b3c4b5d6e7f8a9b0c1",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b1b3c4b5d6e7f8a9b0c1",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "lastLogin": "2025-06-29T12:00:00.000Z"
  }
}
```

### Documents

#### Create Document
```http
POST /api/documents
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "My New Document",
  "isPublic": false
}
```

**Response:**
```json
{
  "message": "Document created successfully",
  "document": {
    "_id": "doc_60f7b1b3c4b5d6e7",
    "title": "My New Document",
    "owner": "60f7b1b3c4b5d6e7f8a9b0c1",
    "isPublic": false,
    "collaborators": [],
    "createdAt": "2025-06-29T12:00:00.000Z",
    "updatedAt": "2025-06-29T12:00:00.000Z"
  }
}
```

#### Get Documents
```http
GET /api/documents
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (optional)
```

**Response:**
```json
{
  "documents": [
    {
      "_id": "doc_60f7b1b3c4b5d6e7",
      "title": "My Document",
      "owner": {
        "id": "60f7b1b3c4b5d6e7f8a9b0c1",
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe"
      },
      "isPublic": false,
      "collaborators": 2,
      "createdAt": "2025-06-29T12:00:00.000Z",
      "updatedAt": "2025-06-29T12:05:00.000Z"
    }
  ]
}
```

#### Add Collaborator
```http
POST /api/documents/doc_60f7b1b3c4b5d6e7/collaborators
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "email": "collaborator@example.com",
  "permission": "write"
}
```

**Response:**
```json
{
  "message": "Collaborator added successfully",
  "collaborator": {
    "userId": "60f7b1b3c4b5d6e7f8a9b0c2",
    "username": "collaborator_user",
    "email": "collaborator@example.com",
    "permission": "write",
    "addedAt": "2025-06-29T12:00:00.000Z"
  }
}
```

## 📡 Socket.io Events

### Connection & Authentication

| Event             | Direction       | Description                                    |
| ----------------- | --------------- | ---------------------------------------------- |
| `connection`      | Client → Server | Client connects (with optional auth token)     |
| `authenticated`   | Server → Client | Authentication successful                      |
| `disconnect`      | Client → Server | Client disconnects from server                 |

### Document Collaboration

| Event             | Direction       | Description                                    |
| ----------------- | --------------- | ---------------------------------------------- |
| `get-document`    | Client → Server | Client requests a document                     |
| `load-document`   | Server → Client | Server sends document data to client           |
| `send-changes`    | Client → Server | Client sends document changes (delta)          |
| `receive-changes` | Server → Client | Server broadcasts changes to other clients     |
| `save-document`   | Client → Server | Client requests to save document               |
| `update-title`    | Client → Server | Client updates document title                  |
| `title-updated`   | Server → Client | Server broadcasts title change                 |

### Chat System

| Event                   | Direction       | Description                           |
| ----------------------- | --------------- | ------------------------------------- |
| `send-chat-message`     | Client → Server | Send a chat message                   |
| `receive-chat-message`  | Server → Client | Receive chat messages                 |
| `user-typing`           | Client → Server | User typing status update             |
| `user-typing-status`    | Server → Client | Broadcast typing indicators           |

### Socket.io Authentication

```javascript
// Client-side connection with authentication
const socket = io('http://localhost:3001', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
});

// Handle authentication events
socket.on('authenticated', (user) => {
  console.log('Authenticated as:', user.username);
});

socket.on('auth-error', (error) => {
  console.error('Authentication failed:', error);
});
```

### Example Socket Usage

#### Document Collaboration
```javascript
// Join document room
socket.emit('get-document', documentId);

// Listen for document content
socket.on('load-document', (document) => {
  quillEditor.setContents(document.data);
  setDocumentTitle(document.title);
});

// Send text changes
quillEditor.on('text-change', (delta, oldDelta, source) => {
  if (source === 'user') {
    socket.emit('send-changes', delta);
  }
});

// Receive changes from other users
socket.on('receive-changes', (delta) => {
  quillEditor.updateContents(delta);
});
```

#### Chat System
```javascript
// Send chat message
socket.emit('send-chat-message', {
  text: 'Hello everyone!',
  documentId: 'doc_60f7b1b3c4b5d6e7'
});

// Receive chat messages
socket.on('receive-chat-message', (message) => {
  addMessageToChat(message);
});

// Send typing indicator
socket.emit('user-typing', true);

// Receive typing indicators
socket.on('user-typing-status', (typingData) => {
  updateTypingIndicators(typingData);
});
```

## 🗄️ Database Schema

### User Model

| Field       | Type     | Description                                  | Required |
| ----------- | -------- | -------------------------------------------- | -------- |
| \_id        | ObjectId | Unique user identifier                       | Yes      |
| username    | String   | Unique username (3-20 chars)                | Yes      |
| email       | String   | Unique email address                         | Yes      |
| password    | String   | Hashed password (bcrypt)                     | Yes      |
| firstName   | String   | User's first name                            | Yes      |
| lastName    | String   | User's last name                             | Yes      |
| role        | String   | User role: 'user' or 'admin'                | Yes      |
| lastLogin   | Date     | Last login timestamp                         | No       |
| createdAt   | Date     | Account creation timestamp                   | Yes      |
| updatedAt   | Date     | Last update timestamp                        | Yes      |

### Document Model

| Field         | Type     | Description                                  | Required |
| ------------- | -------- | -------------------------------------------- | -------- |
| \_id          | String   | Custom document identifier                   | Yes      |
| title         | String   | Document title                               | Yes      |
| data          | Object   | Document content (Quill Delta format)       | No       |
| owner         | ObjectId | Reference to User who owns the document     | No       |
| isPublic      | Boolean  | Whether document is publicly accessible     | Yes      |
| collaborators | Array    | Array of collaborator objects                | No       |
| createdAt     | Date     | Document creation timestamp                  | Yes      |
| updatedAt     | Date     | Last update timestamp                        | Yes      |

### Collaborator Schema (Embedded in Document)

| Field      | Type     | Description                           | Required |
| ---------- | -------- | ------------------------------------- | -------- |
| userId     | ObjectId | Reference to collaborating User       | Yes      |
| permission | String   | Permission level: 'read', 'write'    | Yes      |
| addedAt    | Date     | When collaborator was added           | Yes      |

### Chat Message Model

| Field       | Type     | Description                          | Required |
| ----------- | -------- | ------------------------------------ | -------- |
| \_id        | ObjectId | Unique message identifier            | Yes      |
| text        | String   | Message content                      | Yes      |
| userId      | ObjectId | Reference to User who sent message   | Yes      |
| username    | String   | Cached username for performance      | Yes      |
| firstName   | String   | Cached first name                    | No       |
| lastName    | String   | Cached last name                     | No       |
| documentId  | String   | Associated document ID               | Yes      |
| timestamp   | Date     | When message was sent                | Yes      |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cowrite-db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Optional: Production settings
# NODE_ENV=production
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cowrite
```

### Database Connection

The database connection is configured in `src/config/db.js`. It supports both local MongoDB and MongoDB Atlas connections.

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/cowrite-db
```

**MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cowrite
```

### CORS Configuration

Cross-Origin Resource Sharing is configured to allow requests from the frontend URL specified in `FRONTEND_URL`. In production, update this to your deployed frontend URL.

### JWT Configuration

JSON Web Tokens are used for authentication. Make sure to use a strong, unique secret in production:

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🛡️ Security Features

### Password Security
- **bcrypt hashing** - Passwords are salted and hashed
- **Password requirements** - Minimum complexity enforced
- **Rate limiting** - Login attempt limitations (recommended for production)

### Authentication Security
- **JWT tokens** - Stateless authentication
- **Token expiration** - Configurable token lifetime
- **Secure headers** - CORS and security headers configured

### Input Validation
- **Schema validation** - Mongoose schema validation
- **Data sanitization** - Input cleaning and validation
- **Error handling** - Secure error responses

### Permission System
- **Document ownership** - Users own their documents
- **Collaboration permissions** - Read/write access control
- **Public/private documents** - Visibility control
- **Admin privileges** - Enhanced permissions for admins

## 📊 Performance & Monitoring

### Database Optimization
- **Indexing** - Optimized queries with proper indexes
- **Connection pooling** - Efficient database connections
- **Query optimization** - Lean queries and pagination

### Socket.io Optimization
- **Room management** - Efficient document-based rooms
- **Message deduplication** - Prevents duplicate messages
- **Connection handling** - Graceful connection management

### Recommended Production Settings
```env
NODE_ENV=production
JWT_EXPIRES_IN=1d
# Add rate limiting
# Add logging (Winston, Morgan)
# Add monitoring (PM2, New Relic)
```

## 🧪 Error Handling

The server implements comprehensive error handling with appropriate HTTP status codes:

### HTTP Status Codes

| Code | Description                    | Common Scenarios                          |
| ---- | ------------------------------ | ----------------------------------------- |
| 200  | OK                             | Successful operations                     |
| 201  | Created                        | Document/user creation                    |
| 400  | Bad Request                    | Validation errors, malformed requests     |
| 401  | Unauthorized                   | Missing or invalid authentication         |
| 403  | Forbidden                      | Insufficient permissions                  |
| 404  | Not Found                      | Document/user not found                   |
| 409  | Conflict                       | Duplicate username/email                  |
| 500  | Internal Server Error          | Server-side errors                        |

### Error Response Format

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {
      "field": "specific field information"
    }
  }
}
```

### Common Error Examples

**Validation Error (400):**
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": {
      "password": "Password must be at least 6 characters long"
    }
  }
}
```

**Authentication Error (401):**
```json
{
  "error": {
    "message": "Authentication required",
    "code": "UNAUTHORIZED"
  }
}
```

**Permission Error (403):**
```json
{
  "error": {
    "message": "Insufficient permissions to access this document",
    "code": "FORBIDDEN"
  }
}
```

## 🚀 Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` (use `crypto.randomBytes(64).toString('hex')`)
- [ ] Configure production MongoDB URI
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for production frontend URL
- [ ] Set up process management (PM2)
- [ ] Configure logging (Winston)
- [ ] Set up monitoring and health checks
- [ ] Configure rate limiting
- [ ] Set up SSL/TLS termination
- [ ] Configure backup strategy for MongoDB

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2 Configuration

```json
{
  "apps": [{
    "name": "cowrite-backend",
    "script": "src/server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production",
      "PORT": 3001
    }
  }]
}
```

## 🤝 Contributing

We welcome contributions to improve CoWrite Backend! Here's how to get started:

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/cowrite.git`
3. Install dependencies: `npm install`
4. Create your feature branch: `git checkout -b feature/amazing-feature`
5. Set up your development environment with the `.env` file
6. Make your changes and test thoroughly
7. Commit your changes: `git commit -m 'Add some amazing feature'`
8. Push to the branch: `git push origin feature/amazing-feature`
9. Open a Pull Request

### Code Style

- Use ES6+ features
- Follow existing code formatting
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused

### Testing

Before submitting a PR:
- Test all endpoints with different scenarios
- Verify socket.io events work correctly
- Test authentication flows
- Ensure backward compatibility
- Test error handling

### Areas for Contribution

- **Performance optimization** - Database queries, caching
- **Security enhancements** - Rate limiting, input validation
- **Testing** - Unit tests, integration tests
- **Documentation** - API docs, code comments
- **Features** - New collaboration features, admin tools

## � Additional Resources

- [Authentication API Documentation](./AUTH_API.md) - Detailed auth endpoints
- [Socket.io Documentation](https://socket.io/docs/) - Real-time features
- [MongoDB Documentation](https://docs.mongodb.com/) - Database operations
- [Express.js Documentation](https://expressjs.com/) - Web framework
- [JWT.io](https://jwt.io/) - JSON Web Tokens

## �📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/bPavan16">Pavan</a> © 2025</p>
  <p>
    <a href="https://github.com/bPavan16/cowrite/issues">Report Bug</a> •
    <a href="https://github.com/bPavan16/cowrite/issues">Request Feature</a> •
  </p>
</div>
