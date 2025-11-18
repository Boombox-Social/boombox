"use client";
import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = "600px" }: ModalProps) {

  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .modal-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
          transition: background 0.2s;
        }
        .modal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted);
        }
        .modal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 8px 0;
        }
        .modal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
      `}</style>
      <div
        className="modal-scrollbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          padding: "20px",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div
          className="modal-scrollbar"
          style={{
            background: "var(--card)",
            color: "var(--card-foreground)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            padding: "32px",
            width: "100%",
            maxWidth: maxWidth,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {title && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: 16,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  fontSize: 24,
                  margin: 0,
                  color: "var(--card-foreground)",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="transition-all duration-200"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  fontSize: 28,
                  cursor: "pointer",
                  padding: 4,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--secondary)";
                  e.currentTarget.style.color = "var(--card-foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--muted)";
                }}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </>
  );
}