import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const editInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/api/documents");
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("Failed to load documents. Please try again later.");
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    const loadingToast = toast.loading("Creating new document...");
    try {
      const response = await axios.post("http://localhost:3001/api/documents", {
        title: `Untitled Document - ${Math.floor(Math.random() * 900 + 100)}`,
      });
      toast.dismiss(loadingToast);
      toast.success("Document created successfully");
      navigate(`/documents/${response.data._id}`);
    } catch (err) {
      console.error("Error creating document:", err);
      toast.dismiss(loadingToast);
      toast.error("Failed to create document");
      setError("Failed to create a new document. Please try again.");
    }
  };

  const openDeleteModal = (doc, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDocumentToDelete(doc);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;

    const loadingToast = toast.loading("Deleting document...");
    try {
      await axios.delete(`http://localhost:3001/api/documents/${documentToDelete._id}`);
      setDocuments(documents.filter((doc) => doc._id !== documentToDelete._id));
      toast.dismiss(loadingToast);
      toast.success("Document deleted successfully");
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete document");
      setError("Failed to delete the document. Please try again.");
    } finally {
      closeDeleteModal();
    }
  };

  // Start editing a document title
  const handleStartRename = (doc, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(doc._id);
    setEditTitle(doc.title || "Untitled Document");
  };

  // Save the updated document title
  const handleSaveRename = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!editTitle.trim()) {
      setEditTitle("Untitled Document");
    }

    const loadingToast = toast.loading("Updating document title...");
    try {
      await axios.patch(`http://localhost:3001/api/documents/${id}/title`, {
        title: editTitle.trim() || "Untitled Document",
      });

      // Update local state
      setDocuments(
        documents.map((doc) =>
          doc._id === id
            ? { ...doc, title: editTitle.trim() || "Untitled Document" }
            : doc
        )
      );

      // Exit edit mode
      setEditingId(null);
      toast.dismiss(loadingToast);
      toast.success("Document renamed successfully");
    } catch (err) {
      console.error("Error renaming document:", err);
      toast.dismiss(loadingToast);
      toast.error("Failed to rename document");
      setError("Failed to rename the document. Please try again.");
    }
  };

  // Cancel renaming
  const handleCancelRename = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
    toast.dismiss();
  };

  // Handle keyboard events during rename
  const handleRenameKeyDown = (id, e) => {
    if (e.key === "Enter") {
      handleSaveRename(id, e);
    } else if (e.key === "Escape") {
      handleCancelRename(e);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Delete confirmation modal
  const DeleteConfirmationModal = () => {
    if (!isDeleteModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Document</h3>
            </div>
          </div>
          
          <div className="p-5">
            <p className="text-gray-700">
              Are you sure you want to delete "<span className="font-medium">{documentToDelete?.title || 'Untitled Document'}</span>"? 
              This action cannot be undone.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 flex justify-end space-x-3">
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: "#E8F5E9",
              color: "#2E7D32",
              borderLeft: "4px solid #2E7D32",
            },
          },
          error: {
            style: {
              background: "#FFEBEE",
              color: "#C62828",
              borderLeft: "4px solid #C62828",
            },
          },
          loading: {
            style: {
              background: "#E3F2FD",
              color: "#1565C0",
              borderLeft: "4px solid #1565C0",
            },
          },
          duration: 3000,
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />

      <div className="max-w-5xl mx-auto">
        {/* Header with search and create button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            My Documents
          </h1>

          <div className="flex gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <button
              onClick={handleCreateDocument}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Document
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 mt-12">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading your documents...
            </p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              No documents found
            </h3>
            <p className="text-gray-500 mb-5">
              {searchTerm
                ? "No documents matching your search criteria."
                : "Get started by creating your first document."}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="text-blue-600 hover:text-blue-800 font-medium underline underline-offset-2"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={handleCreateDocument}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create a document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                onClick={() =>
                  editingId !== doc._id && navigate(`/documents/${doc._id}`)
                }
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4 text-blue-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>

                      {editingId === doc._id ? (
                        <div
                          className="flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleRenameKeyDown(doc._id, e)}
                            className="border-b-2 border-blue-500 px-2 py-1 text-lg font-semibold text-gray-800 w-full focus:outline-none bg-transparent"
                            autoComplete="off"
                          />
                          <button
                            onClick={(e) => handleSaveRename(doc._id, e)}
                            className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="ml-1 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {doc.title || "Untitled Document"}
                        </h2>
                      )}
                    </div>

                    <div className="mt-2 ml-14 flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Last edited: {formatDate(doc.updatedAt)}
                      </span>
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Created: {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </div>

                  {editingId !== doc._id && (
                    <div
                      className="flex items-center space-x-2 sm:justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleStartRename(doc, e)}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Rename
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(doc, e)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;