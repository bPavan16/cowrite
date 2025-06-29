import { useCallback } from "react";
import { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import { useParams } from "react-router-dom";
import "./TextEditor.css";

import { io, Socket } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import ShareModal from "../../components/sharing/ShareModal";
import ChatPanel from "../../components/chat/ChatPanel";
import { Button } from "../../components/ui/button";
import { Share, MessageCircle } from "lucide-react";

interface DocumentData {
  data?: unknown;
  title?: string;
  owner?: unknown;
  collaborators?: unknown[];
  isPublic?: boolean;
}

const TextEditor = () => {
  // All the State variables and functions are defined here

  const { id: documentId } = useParams();
  const { token, user } = useAuth();

  console.log("Document ID:", documentId);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", {
        data: quill.getContents(),
        title: documentTitle,
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentTitle]);

  useEffect(() => {
    if (quill === null || socket === null) return;

    socket.once("load-document", (document: DocumentData) => {
      if (document.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        quill.setContents(document.data as any || "");
      }
      setDocumentTitle(document.title || "Untitled Document");
      quill.enable();
    });

    socket.emit("get-document", documentId, documentTitle);

    return () => {};
  }, [documentId, quill, socket, documentTitle]);

  useEffect(() => {
    const socketOptions = {
      auth: {} as Record<string, string>
    };
    
    // Add authentication token if available
    if (token) {
      socketOptions.auth.token = token;
    }

    const socket = io("http://localhost:3001", socketOptions);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (delta: any) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (delta: any, _oldDelta: any, source: string) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (wrapper === null) return;

    wrapper.innerHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);

    // Create the Quill instance
    const quillInstance = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: [
          // Header dropdown with more options
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // Font family
          [{ font: [] }],

          // Font size
          [{ size: [] }],

          // Bold, italic, underline, strike
          ["bold", "italic", "underline", "strike"],

          // Text color and background color
          [{ color: [] }, { background: [] }],

          // Alignment options
          [{ align: [] }],

          // Lists, both ordered and bullet
          [{ list: "ordered" }, { list: "bullet" }],

          // Indentation
          [{ indent: "-1" }, { indent: "+1" }],

          // Text direction
          [{ direction: "rtl" }],

          // Specialized formats
          ["blockquote", "code-block"],

          // Superscript/subscript
          [{ script: "sub" }, { script: "super" }],

          // Media
          ["link"],

          // Remove formatting
        ],
      },
    });

    quillInstance.setText("Loading..."); // Set initial text
    quillInstance.disable(); // Disable editing initially

    quillInstance.setText("")

    // Save the Quill instance to state

    setQuill(quillInstance);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Beautiful Header with editable title and share button */}
      <div className="bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30 border-b border-border/50 shadow-sm backdrop-blur-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Editable Document Title */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              <input
                type="text"
                value={documentTitle}
                
                onChange={(e) => setDocumentTitle(e.target.value)}
                onBlur={() => {
                  // Save title change when user finishes editing
                  if (socket && quill) {
                    socket.emit("save-document", {
                      data: quill.getContents(),
                      title: documentTitle,
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="text-xl font-bold bg-transparent border-none outline-none focus:bg-white  focus:px-3 focus:py-1 focus:rounded-lg focus:shadow-sm transition-all duration-200 min-w-0 max-w-[max-content] flex-1 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Untitled Document"
                spellCheck={false}
              />
            </div>
            
            {/* Document Status Indicator */}
            <div className="flex items-center gap-2 mx-3 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="hidden sm:inline">Auto-saved</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              size="sm"
              variant={isChatOpen ? "default" : "outline"}
              className="gap-2 transition-all duration-200 hover:shadow-md"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </Button>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              size="sm"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Editor Container */}
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 dark:from-gray-900/50 dark:via-gray-900 dark:to-blue-950/30 py-6 px-4 flex justify-center">
        <div className="w-full max-w-6xl">
          {/* Editor with beautiful styling */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm">
            <div id="container" ref={wrapperRef} className="min-h-[600px] min-w-[1200px]" />
          </div>
        </div>
      </div>
      
      {/* Enhanced Status bar */}
      <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border-t border-border/50 px-6 py-2 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Document ID: {documentId}</span>
          {user && (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>{socket ? 'Connected' : 'Disconnected'}</span>
          <span className="text-xs opacity-60">Last saved: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Share Modal */}
      {documentId && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          documentId={documentId}
          documentTitle={documentTitle}
          onUpdate={() => {}} // Could trigger a document refetch if needed
        />
      )}

      {/* Chat Panel */}
      <ChatPanel
        socket={socket}
        currentUser={user}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
};

export default TextEditor;
