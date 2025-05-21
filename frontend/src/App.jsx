import TextEditor from "./pages/TextEditor/TextEditor";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/documents/${uuidV4()}`} replace />}
        />
        <Route
          path="/documents/:id"
          element={
            <div className="container mx-auto flex flex-col h-screen">
              {/* <Header /> */}
              <TextEditor />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
