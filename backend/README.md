<div align="center">
    
# 📝 CoWrite Backend

### A powerful real-time collaboration server

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg)](https://socket.io/)

</div>

## 🚀 Overview

The CoWrite Backend powers our real-time collaborative document editor with a robust API and WebSocket server. It handles document storage, real-time updates, and synchronization between multiple connected clients.

## ✨ Features

- **Real-time document collaboration** - WebSocket-based synchronization
- **Document persistence** - MongoDB storage for documents
- **RESTful API** - Complete CRUD operations for documents
- **Title synchronization** - Real-time title updates across clients
- **Auto-saving** - Automatic document persistence
- **Scalable architecture** - Designed for performance and reliability

## 🛠️ Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web server framework
- **Socket.io** - WebSocket communication
- **MongoDB** - Document database
- **Mongoose** - MongoDB object modeling
- **Cors** - Cross-origin resource sharing

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js               # Database connection configuration
│   ├── models/
│   │   └── document.model.js   # Document schema and model
│   ├── routes/
│   │   └── document.routes.js  # REST API endpoints
│   ├── utils/
│   │   └── db.utils.js         # Database utility functions
│   └── server.js               # Main application entry point
├── .env                        # Environment variables (create this)
├── package.json                # Dependencies and scripts
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
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/cowrite-db
   FRONTEND_URL=http://localhost:5173
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

### Documents

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| GET    | `/api/documents`           | Get all documents (without content) |
| GET    | `/api/documents/:id`       | Get a specific document by ID       |
| POST   | `/api/documents`           | Create a new document               |
| PATCH  | `/api/documents/:id/title` | Update a document's title           |
| DELETE | `/api/documents/:id`       | Delete a document                   |

### Example Requests

#### Create a new document

```bash
curl -X POST http://localhost:3001/api/documents \
  -H "Content-Type: application/json" \
  -d '{"title": "My New Document"}'
```

#### Get all documents

```bash
curl http://localhost:3001/api/documents
```

## 📡 Socket.io Events

| Event             | Direction       | Description                                |
| ----------------- | --------------- | ------------------------------------------ |
| `connection`      | Client → Server | Client connects to the server              |
| `get-document`    | Client → Server | Client requests a document                 |
| `load-document`   | Server → Client | Server sends document data to client       |
| `send-changes`    | Client → Server | Client sends document changes              |
| `receive-changes` | Server → Client | Server broadcasts changes to other clients |
| `save-document`   | Client → Server | Client requests to save document           |
| `update-title`    | Client → Server | Client updates document title              |
| `title-updated`   | Server → Client | Server broadcasts title change             |
| `disconnect`      | Client → Server | Client disconnects from server             |

## 🗄️ Database Schema

### Document Model

| Field     | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| \_id      | String | Custom document identifier                       |
| title     | String | Document title (defaults to "Untitled Document") |
| data      | String | Document content (stringified JSON)              |
| createdAt | Date   | Document creation timestamp                      |
| updatedAt | Date   | Last update timestamp                            |

## 🔧 Configuration

### Database Connection

The database connection is configured in db.js. By default, it connects to a local MongoDB instance at `mongodb://localhost:27017/cowrite-db`.

To use a different connection string:

1. Update the connection string in db.js, or
2. Set the `MONGODB_URI` environment variable

### CORS Configuration

Cross-Origin Resource Sharing is configured in server.js. By default, it allows requests from `http://localhost:5173` (the development frontend).

To allow different origins:

1. Update the `origin` value in the CORS configuration, or
2. Set the `FRONTEND_URL` environment variable

## 🧪 Error Handling

The server implements comprehensive error handling:

- API endpoints catch and respond with appropriate status codes
- Socket events have error handling to prevent server crashes
- Database operations are wrapped in try/catch blocks

## 🤝 Contributing

1. Ensure you have the latest code
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Built with ❤️ By Pavan</p>
</div>
