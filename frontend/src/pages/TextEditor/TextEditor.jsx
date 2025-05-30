import React from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback } from "react";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import "./TextEditor.css";

import { io } from "socket.io-client";

const TextEditor = () => {
  // All the State variables and functions are defined here

  const { id: documentId } = useParams();

  console.log("Document ID:", documentId);

  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", {
        data: quill.getContents(),
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (quill === null || socket === null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);

    return () => {};
  }, [documentId, quill, socket]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket === null || quill === null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
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

    quillInstance.disable(); // Disable editing initially
    quillInstance.setText("Loading..."); // Set initial text

    // Save the Quill instance to state
    setQuill(quillInstance);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto py-3 shadow-2xl px-4 flex justify-center">
        <div className="w-full max-w-6xl pb-10 h-[11in]">
          {/* Quill editor container */}
          <div id="container" ref={wrapperRef} className="h-full" />
        </div>
      </div>
      {/* Status bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-1.5 flex justify-between items-center"></div>

      <style jsx>{``}</style>
    </div>
  );
};

export default TextEditor;
