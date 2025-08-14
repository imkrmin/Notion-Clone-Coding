import "./styles/index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/sidebar/index";
import { useDocumentStore } from "./stores/documentStore";
import { useCallback } from "react";
import DocumentPage from "./pages/DocumentPage";
import HomePage from "./pages/HomePage";

function App() {
  const { currentDocument, selectDocument } = useDocumentStore();

  const handleDocumentSelect = useCallback(
    (documentId: string) => {
      selectDocument(documentId);
    },
    [selectDocument]
  );

  return (
    <div className="flex w-full h-screen">
      <div className="flex-shrink-0 w-64 border-r border-gray-200">
        <Sidebar
          onDocumentSelect={handleDocumentSelect}
          selectedDocumentId={currentDocument?.id}
        />
      </div>

      <div className="flex-1 h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/documents/:id" element={<DocumentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
