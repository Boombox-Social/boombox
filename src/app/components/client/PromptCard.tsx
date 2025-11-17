"use client";
import React, { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

interface Prompt {
  label: string;
  content: string;
}

interface PromptCardProps {
  title: string;
  description: string;
  prompts: Prompt[];
}

export function PromptCard({ title, description, prompts }: PromptCardProps) {
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
    <div className="mb-6">
      <h3
        className="text-base font-bold mb-3 tracking-tight"
        style={{ color: "var(--card-foreground)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm mb-4 leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        {description}
      </p>

      <div className="space-y-3">
        {prompts.map((prompt, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--card-foreground)" }}
              >
                {prompt.label}
              </span>
              <button
                onClick={() => copyToClipboard(prompt.content, index)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                style={{
                  background: copiedIndex === index ? "var(--success)" : "var(--secondary)",
                  color: copiedIndex === index ? "#ffffff" : "var(--card-foreground)",
                  border: `1px solid ${copiedIndex === index ? "var(--success)" : "var(--border)"}`,
                }}
                onMouseEnter={(e) => {
                  if (copiedIndex !== index) {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary-foreground)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (copiedIndex !== index) {
                    e.currentTarget.style.background = "var(--secondary)";
                    e.currentTarget.style.color = "var(--card-foreground)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }
                }}
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div
              className="text-sm leading-relaxed p-4 rounded-md cursor-pointer transition-all duration-200"
              style={{
                color: "var(--muted)",
                background: "var(--background)",
                border: "1px solid var(--border)",
              }}
              onClick={() => copyToClipboard(prompt.content, index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              "{prompt.content}"
            </div>
          </div>
        ))}
      </div>

      <hr
        className="my-6"
        style={{ border: 0, borderTop: "1px solid var(--border)" }}
      />
    </div>
  );
}