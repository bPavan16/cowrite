import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import ShareModal from "../../components/sharing/ShareModal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle, FileText, Plus, Search, Edit, Share, Trash2, Globe, Calendar, Check, X } from "lucide-react";

interface Document {
  _id: string;
  title: string;
  owner?: {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  collaborators?: Array<{
    user: {
      _id: string;
      username: string;
      email: string;
      firstName?: string;
      lastName?: string;
    };
    permission: string;
  }>;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [documentToShare, setDocumentToShare] = useState<Document | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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
    if (!isAuthenticated) {
      toast.error("Please sign in to create documents");
      return;
    }

    const loadingToast = toast.loading("Creating new document...");
    try {
      const response = await axios.post("http://localhost:3001/api/documents", {
        title: `Untitled Document - ${Math.floor(Math.random() * 900 + 100)}`,
      });
      toast.dismiss(loadingToast);
      toast.success("Document created successfully");
      navigate(`/documents/${response.data._id}`);
    } catch (err: unknown) {
      console.error("Error creating document:", err);
      toast.dismiss(loadingToast);
      const errorResponse = err as { response?: { status?: number } };
      if (errorResponse.response?.status === 401) {
        toast.error("Please sign in to create documents");
      } else {
        toast.error("Failed to create document");
      }
      setError("Failed to create a new document. Please try again.");
    }
  };

  const openDeleteModal = (doc: Document, e: React.MouseEvent) => {
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

  // Share modal handlers
  const openShareModal = (doc: Document, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDocumentToShare(doc);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setDocumentToShare(null);
  };

  // Start editing a document title
  const handleStartRename = (doc: Document, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(doc._id);
    setEditTitle(doc.title || "Untitled Document");
  };

  // Save the updated document title
  const handleSaveRename = async (id: string, e: React.FormEvent) => {
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
  const handleCancelRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
    toast.dismiss();
  };

  // Handle keyboard events during rename
  const handleRenameKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveRename(id, e);
    } else if (e.key === "Escape") {
      handleCancelRename(e as unknown as React.MouseEvent);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if user can edit/delete a document
  const canUserEditDocument = (doc: Document) => {
    if (!isAuthenticated || !user) return false;

    // User is the owner
    if (doc.owner && doc.owner._id === user.id) return true;

    // User is a collaborator with write/admin permission
    if (doc.collaborators) {
      const collaboration = doc.collaborators.find(collab => collab.user._id === user.id);
      if (collaboration && ['write', 'admin'].includes(collaboration.permission)) {
        return true;
      }
    }

    // Legacy documents without owner (for backward compatibility)
    if (!doc.owner) return true;

    return false;
  };

  const getDocumentOwnerDisplay = (doc: Document) => {
    if (doc.owner) {
      return doc.owner.firstName
        ? `${doc.owner.firstName} ${doc.owner.lastName || ''}`.trim()
        : doc.owner.username;
    }
    return null;
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete Document
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "<span className="font-medium">{documentToDelete?.title || 'Untitled Document'}</span>"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      {documentToShare && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={closeShareModal}
          documentId={documentToShare._id}
          documentTitle={documentToShare.title}
          onUpdate={fetchDocuments}
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header with search and create button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
              My Documents
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documents..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {isAuthenticated && (
              <Button
                onClick={handleCreateDocument}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Document
              </Button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card className="mt-12 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-blue-500" />
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
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            ) : (
              <Button onClick={handleCreateDocument}>
                <Plus className="h-4 w-4 mr-2" />
                Create a document
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc._id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                onClick={() =>
                  editingId !== doc._id && navigate(`/documents/${doc._id}`)
                }
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4 text-blue-500">
                          <FileText className="h-6 w-6" />
                        </div>

                        {editingId === doc._id ? (
                          <div
                            className="flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Input
                              ref={editInputRef}
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => handleRenameKeyDown(doc._id, e)}
                              className="text-lg font-semibold"
                              autoComplete="off"
                            />
                            <Button
                              size="sm"
                              className="ml-2"
                              onClick={(e) => handleSaveRename(doc._id, e)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="ml-1"
                              onClick={handleCancelRename}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {doc.title || "Untitled Document"}
                          </h2>
                        )}
                      </div>

                      <div className="mt-2 ml-14 flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          Last edited: {formatDate(doc.updatedAt)}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          Created: {formatDate(doc.createdAt)}
                        </span>
                        {getDocumentOwnerDisplay(doc) && (
                          <div className="flex items-center">
                            <Avatar className="h-4 w-4 mr-1">
                              <AvatarFallback className="text-xs">
                                {getDocumentOwnerDisplay(doc)?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            Owner: {getDocumentOwnerDisplay(doc)}
                          </div>
                        )}
                        {doc.isPublic && (
                          <Badge variant="secondary" className="text-green-600 bg-green-50">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>

                    {editingId !== doc._id && canUserEditDocument(doc) && (
                      <div
                        className="flex items-center space-x-2 sm:justify-end md:opacity-0 md:group-hover:opacity-100 sm:opacity-10  transition-opacity duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-400 hover:text-orange-500 hover:bg-orange-50"

                          onClick={(e) => handleStartRename(doc, e)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Rename
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={(e) => openShareModal(doc, e)}
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => openDeleteModal(doc, e)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;