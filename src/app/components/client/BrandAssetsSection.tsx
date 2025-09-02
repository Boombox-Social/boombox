// File Structure: src/app/components/client/BrandAssetsSection.tsx - Brand assets as URLs
"use client";
import React, { useState } from "react";
import { Client } from "../../types";

const colors = {
  bg: "#181A20",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  accent: "#2563eb",
  success: "#10b981",
  error: "#ef4444",
};

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

  // Use local value or fallback to client data
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
    <div style={{ gridColumn: "1 / -1" }}>
      <div
        style={{
          fontWeight: 700,
          marginBottom: 6,
          color: colors.text,
          fontSize: 14,
        }}
      >
        Brand Assets
      </div>

      {editing ? (
        <div>
          {/* Current Assets */}
          {brandAssets.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 12,
                marginBottom: 12,
              }}
            >
              {brandAssets.map((assetUrl, index) => (
                <div
                  key={index}
                  style={{
                    background: colors.border,
                    borderRadius: 8,
                    padding: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 4,
                      background: colors.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.text,
                      fontSize: 12,
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                  >
                    🔗
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a
                      href={assetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: colors.accent,
                        textDecoration: "none",
                        fontSize: 13,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {assetUrl}
                    </a>
                  </div>
                  <button
                    onClick={() => removeAsset(index)}
                    style={{
                      background: colors.error,
                      color: colors.text,
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Asset */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                style={{
                  flex: 1,
                  background: colors.bg,
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: "8px 12px",
                  fontSize: 14,
                  outline: "none",
                }}
                type="url"
                value={newAssetUrl}
                onChange={(e) => {
                  setNewAssetUrl(e.target.value);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && addAsset()}
                placeholder="https://example.com/brand-asset.png"
              />
              <button
                style={{
                  background: colors.accent,
                  color: colors.text,
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 14,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={addAsset}
              >
                Add Asset
              </button>
            </div>

            {error && (
              <div
                style={{
                  color: colors.error,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                color: colors.muted,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              Add URLs to brand guidelines, logos, color palettes, etc.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            minHeight: 60,
            padding: "8px 12px",
            border: `1px solid transparent`,
            borderRadius: 6,
          }}
        >
          {brandAssets.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 8,
              }}
            >
              {brandAssets.map((assetUrl, index) => (
                <a
                  key={index}
                  href={assetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: colors.border,
                    borderRadius: 6,
                    padding: 8,
                    color: colors.accent,
                    textDecoration: "none",
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    overflow: "hidden",
                  }}
                >
                  <span style={{ flexShrink: 0 }}>🔗</span>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {assetUrl}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div
              style={{
                color: colors.muted,
                fontStyle: "italic",
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                minHeight: 40,
              }}
            >
              No brand assets provided
            </div>
          )}
        </div>
      )}
    </div>
  );
}
