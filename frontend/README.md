<div align="center">
  
# 📝 CoWrite Frontend
  
  
  ### A modern, real-time collaborative document editor
  
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
  [![Socket.io Client](https://img.shields.io/badge/Socket.io--client-4.x-black.svg)](https://socket.io/docs/v4/client-api/)

</div>

## 🚀 Overview

This is the frontend application for CoWrite, a real-time collaborative document editor. Built with React and Vite, it provides a smooth, responsive interface for creating and editing documents in real-time with other users.

## ✨ Features

- **Real-time editing** - See changes from collaborators as they type
- **Rich text formatting** - Format text with various styles and options
- **Document management** - Create, browse, rename, and delete documents
- **Responsive design** - Works on desktop and mobile devices
- **Toast notifications** - Elegant feedback for user actions
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS

## 🛠️ Technology Stack

- **React** - UI library
- **Vite** - Build tool and development server
- **React Router** - For navigation between pages
- **Quill.js** - Rich text editor
- **Socket.io Client** - For real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - For API requests
- **React Hot Toast** - For notifications

## 📁 Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── Documents/  # Document list and management
│   │   └── TextEditor/ # Document editing interface
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Application entry point
├── .eslintrc.cjs       # ESLint configuration
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cowrite.git
   cd cowrite/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🔌 Connecting to Backend

By default, the frontend connects to the backend at `http://localhost:3001`. If your backend is running on a different URL, you can update this in:

- `src/pages/TextEditor/TextEditor.jsx` - For Socket.io connection
- API request URLs in various components

## 📚 Key Components

### TextEditor

The main editor component that uses Quill.js and Socket.io to provide real-time collaborative editing.

### DocumentList

Displays all available documents with options to create, rename, and delete documents.

### Header

Navigation component that appears on all pages.

## 🧪 Linting and Code Quality

This project uses ESLint for code quality. Run linting with:

```bash
npm run lint
# or
yarn lint
```

## 🤝 Contributing

1. Ensure you have the latest code from the main branch
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting to ensure code quality
5. Commit your changes
6. Push to your branch
7. Open a Pull Request

## 📄 License

This project is part of the CoWrite application and is licensed under the MIT License.

---

<div align="center">
  <p>Built with ❤️ using React and Vite</p>
</div>
