import { useCallback } from "react";
import { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import { useParams } from "react-router-dom";
import "./TextEditor.css";

import { io, Socket } from "socket.io-client";
import { useAuth } from "../../hooks/useAuth";
import ShareModal from "../../components/sharing/ShareModal";
import { Button } from "../../components/ui/button";
import { Share } from "lucide-react";

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
  const { token } = useAuth();

  console.log("Document ID:", documentId);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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
      {/* Header with title and share button */}
      <div className="bg-card border-b px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">{documentTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsShareModalOpen(true)}
            size="sm"
            className="gap-2"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-3 shadow-2xl px-4 flex justify-center">
        <div className="w-full max-w-6xl pb-10 h-[11in]">
          {/* Quill editor container */}
          <div id="container" ref={wrapperRef} className="h-full" />
        </div>
      </div>
      {/* Status bar */}
      <div className="bg-card border-t px-4 py-1.5 flex justify-between items-center"></div>

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
    </div>
  );
};

export default TextEditor;
