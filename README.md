
<div align="center">
  
# 📝 CoWrite
  
  ### A real-time collaborative document editor
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg)](https://socket.io/)

</div>

## ✨ Features

- **Real-time collaboration** - Multiple users can edit documents simultaneously
- **Rich text editing** - Format text with various styles and formatting options
- **Document management** - Create, rename, and delete documents
- **Auto-saving** - Changes are automatically saved to the database
- **Responsive design** - Works on desktop and mobile devices
- **User-friendly interface** - Clean, modern UI with intuitive controls

## 🖥️ Screenshots

<div align="center">
  <img src="images\image4.jpg" alt="Document List" width="80%"/>
  <p><em>Home Page for Cowrite</em></p>

  <img src="images\image1.png" alt="Document Editor" width="80%"/>
  <p><em>Document management dashboard</em></p>
  
  <img src="images\image2.png" alt="Document List" width="80%"/>
  <p><em>Document Editor with rich text formatting</em></p>
  
  <img src="images\image3.jpg" alt="Document List" width="80%"/>
  <p><em>Document Editor with rich text formatting</em></p>

</div>

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **React Router** - Navigation
- **Quill.js** - Rich text editor
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket communication
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## 🏗️ Architecture

CoWrite follows a client-server architecture:

1. **Frontend**: React application that handles UI rendering and user interactions
2. **Backend**: Node.js server that manages document operations and real-time collaboration
3. **Database**: MongoDB for document storage
4. **Real-time Communication**: Socket.io for bidirectional communication between clients and server

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cowrite.git
   cd cowrite
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/cowrite
   ```

### Running the Application

1. Start the MongoDB server (if using local MongoDB)

2. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

3. Start the frontend development server:

   ```bash
   cd frontend
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🔍 Usage

### Creating a New Document

1. Click on the "New Document" button on the home page
2. Start typing in the editor
3. The document will be auto-saved as you type

### Collaborating on a Document

1. Share the document URL with collaborators
2. Multiple users can edit the document simultaneously
3. Changes appear in real-time for all connected users

### Managing Documents

1. View all your documents on the home page
2. Rename documents by clicking the "Rename" button
3. Delete documents using the "Delete" button

## 📡 API Endpoints

### Documents

- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get a specific document
- `POST /api/documents` - Create a new document
- `PATCH /api/documents/:id/title` - Update document title
- `DELETE /api/documents/:id` - Delete a document

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Quill.js](https://quilljs.com/) for the rich text editor
- [Socket.io](https://socket.io/) for real-time capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [React Hot Toast](https://react-hot-toast.com/) for beautiful notifications

---

<div align="center">
  <p>Made with ❤️ by Your Name</p>
  <p>© 2023</p>
</div>

Similar code found with 2 license types
