"use client";
import React, { useState } from "react";
import { Client } from "../../types";

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
    <div className="col-span-full">
      <div className="font-bold mb-1.5 text-foreground text-sm">
        Brand Assets
      </div>

      {editing ? (
        <div>
          {/* Current Assets */}
          {brandAssets.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3 mb-3">
              {brandAssets.map((assetUrl, index) => (
                <div
                  key={index}
                  className="bg-secondary rounded-lg p-3 flex items-center gap-2 border border-border"
                >
                  <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                    🔗
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={assetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary no-underline text-[13px] block overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
                    >
                      {assetUrl}
                    </a>
                  </div>
                  <button
                    onClick={() => removeAsset(index)}
                    className="bg-red-500 text-white border-none rounded-full w-5 h-5 cursor-pointer text-xs flex items-center justify-center flex-shrink-0 hover:bg-red-600 transition-colors"
                    aria-label="Remove asset"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Asset */}
          <div>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 bg-background text-foreground border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                className="bg-primary text-primary-foreground border-none rounded-md px-4 py-2 text-sm cursor-pointer font-semibold hover:opacity-90 transition-opacity"
                onClick={addAsset}
              >
                Add Asset
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-xs mt-1">
                {error}
              </div>
            )}

            <div className="text-muted-foreground text-xs mt-1">
              Add URLs to brand guidelines, logos, color palettes, etc.
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[60px] px-3 py-2 border border-transparent rounded-md">
          {brandAssets.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
              {brandAssets.map((assetUrl, index) => (
                <a
                  key={index}
                  href={assetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary rounded-md p-2 text-primary no-underline text-xs flex items-center gap-1.5 overflow-hidden hover:bg-secondary/80 transition-colors"
                >
                  <span className="flex-shrink-0">🔗</span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {assetUrl}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground italic text-sm flex items-center min-h-[40px]">
              No brand assets provided
            </div>
          )}
        </div>
      )}
    </div>
  );
}