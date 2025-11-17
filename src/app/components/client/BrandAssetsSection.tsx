"use client";
import React, { useState } from "react";
import { Client } from "../../types";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface BrandAssetsSectionProps {
  client: Client;
  editing: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export function BrandAssetsSection({
  client,
  editing,
  value = [],
  onChange,
}: BrandAssetsSectionProps) {
  const [newAssetUrl, setNewAssetUrl] = useState("");
  const [error, setError] = useState("");

  const brandAssets = value.length > 0 ? value : client.brandAssets || [];

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const addAsset = () => {
    if (!newAssetUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!validateUrl(newAssetUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    const updatedAssets = [...brandAssets, newAssetUrl.trim()];
    onChange?.(updatedAssets);
    setNewAssetUrl("");
    setError("");
  };

  const removeAsset = (index: number) => {
    const updatedAssets = brandAssets.filter((_, i) => i !== index);
    onChange?.(updatedAssets);
  };

  return (
    <div className="p-4 rounded-md" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
      <label className="block text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>
        Brand Assets
      </label>

      {editing ? (
        <div>
          {brandAssets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {brandAssets.map((assetUrl, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-md"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    🔗
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={assetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs block overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
                      style={{ color: "var(--primary)" }}
                    >
                      {assetUrl}
                    </a>
                  </div>
                  <button
                    onClick={() => removeAsset(index)}
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: "var(--danger)", color: "#ffffff" }}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 px-3 py-2 rounded-md text-sm outline-none transition-all"
                style={{
                  border: "2px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                }}
                type="url"
                value={newAssetUrl}
                onChange={(e) => {
                  setNewAssetUrl(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && addAsset()}
                placeholder="https://example.com/brand-asset.png"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                onClick={addAsset}
                className="px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                <PlusIcon className="w-4 h-4" />
                Add
              </button>
            </div>

            {error && (
              <div className="text-xs mt-1" style={{ color: "var(--danger)" }}>
                {error}
              </div>
            )}

            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Add URLs to brand guidelines, logos, color palettes, etc.
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[60px] p-3 rounded-md">
          {brandAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {brandAssets.map((assetUrl, index) => (
                <a
                  key={index}
                  href={assetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-md text-xs hover:underline"
                  style={{ background: "var(--secondary)", color: "var(--primary)" }}
                >
                  <span className="flex-shrink-0">🔗</span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {assetUrl}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-sm italic flex items-center min-h-[40px]" style={{ color: "var(--muted)" }}>
              No brand assets provided
            </div>
          )}
        </div>
      )}
    </div>
  );
}