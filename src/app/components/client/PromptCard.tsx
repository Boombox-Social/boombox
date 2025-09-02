"use client";
import React, { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
};

interface Prompt {
  label: string;
  content: string;
}

interface PromptCardProps {
  title: string;
  prompts: Prompt[];
}

export function PromptCard({ title, prompts }: PromptCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 16,
          marginBottom: 12,
          color: colors.text,
        }}
      >
        {title}
      </div>

      <div style={{ marginBottom: 20 }}>
        {prompts.map((prompt, index) => (
          <div key={index} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontWeight: 600,
                color: colors.text,
                fontSize: 14,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{prompt.label}</span>
              <button
                onClick={() => copyToClipboard(prompt.content, index)}
                style={{
                  background: "none",
                  border: "none",
                  color: copiedIndex === index ? "#10b981" : colors.muted,
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  transition: "color 0.2s",
                }}
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <>
                    <CheckIcon
                      width={16}
                      height={16}
                      style={{ marginRight: 4 }}
                    />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardIcon
                      width={16}
                      height={16}
                      style={{ marginRight: 4 }}
                    />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div
              style={{
                fontSize: 13,
                color: colors.muted,
                lineHeight: 1.4,
                background: colors.bg,
                padding: 12,
                borderRadius: 6,
                border: `1px solid ${colors.border}`,
                cursor: "pointer",
                position: "relative",
                transition: "border-color 0.2s",
              }}
              onClick={() => copyToClipboard(prompt.content, index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              "{prompt.content}"
            </div>
          </div>
        ))}
      </div>

      <hr
        style={{
          border: 0,
          borderTop: `1px solid ${colors.border}`,
          margin: "18px 0",
        }}
      />
    </div>
  );
}
