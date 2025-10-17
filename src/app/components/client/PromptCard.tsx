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
      <div className="font-bold text-base mb-3 text-foreground">
        {title}
      </div>
      <div className="text-sm text-muted-foreground py-2">{description}</div>

      <div className="mb-5">
        {prompts.map((prompt, index) => (
          <div key={index} className="mb-3">
            <div className="font-semibold text-foreground text-sm mb-1.5 flex items-center justify-between">
              <span>{prompt.label}</span>
              <button
                onClick={() => copyToClipboard(prompt.content, index)}
                className={`
                  bg-transparent border-none cursor-pointer
                  px-1 py-1 rounded flex items-center gap-1
                  text-xs transition-colors
                  ${copiedIndex === index ? 'text-green-500' : 'text-muted-foreground hover:text-foreground'}
                `}
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
              className="
                text-[13px] text-muted-foreground leading-snug
                bg-background p-3 rounded-md
                border border-border
                cursor-pointer relative
                transition-colors
                hover:border-primary
              "
              onClick={() => copyToClipboard(prompt.content, index)}
            >
              "{prompt.content}"
            </div>
          </div>
        ))}
      </div>

      <hr className="border-0 border-t border-border my-4.5" />
    </div>
  );
}