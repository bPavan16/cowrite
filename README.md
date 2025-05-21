Collecting workspace information# CoWrite - Collaborative Document Editor

CoWrite is a real-time collaborative document editor application inspired by Google Docs. It allows multiple users to simultaneously edit the same document and see each other's changes in real-time.

## Features

- Real-time collaborative text editing
- Rich text formatting with a comprehensive toolbar
- Document autosaving
- Unique URLs for each document
- Responsive design

## Technologies Used

### Frontend
- React 19
- Vite 6
- React Router 7
- Quill rich text editor
- Socket.io client for real-time communication
- Tailwind CSS for styling
- UUID for document ID generation

### Backend
- Node.js
- Socket.io for WebSocket communication

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. You'll be automatically redirected to a new document with a unique ID
3. Share the document URL with collaborators to edit together
4. Use the rich text toolbar to format your document

## Project Structure

```
cowrite/
├── README.md
├── backend/
│   ├── package.json
│   └── src/
│       └── server.js
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        └── components/
            ├── Header/
            │   └── Header.jsx
            └── TextEditor/
                ├── TextEditor.css
                └── TextEditor.jsx
```

## Future Improvements

- User authentication and authorization
- Persistent document storage
- Document sharing options and permissions
- Cursor presence to show other users' positions
- Mobile optimization

## License

This project is available as open source under the terms of the MIT License.