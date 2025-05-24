import TextEditor from "./pages/TextEditor/TextEditor";
import DocumentList from "./pages/Documents/DocumentList";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/documents" element={<DocumentList />} />
          <Route
            path="/documents/new"
            element={<Navigate to={`/documents/${uuidV4()}`} replace />}
          />
          <Route
            path="/documents/:id"
            element={
              <div className="container mx-auto flex flex-col h-screen">
                <TextEditor />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
