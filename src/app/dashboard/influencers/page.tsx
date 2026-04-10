// src/app/dashboard/influencers/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Influencer,
  CreateInfluencerDto,
  UpdateInfluencerDto,
  Tier,
  InfluencerFilters,
} from "@/app/types/influencer.types";
import InfluencerTable from "@/app/components/influencer/InfluencerTable";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<InfluencerFilters>({
    search: "",
    tier: "all",
    niche: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueNiches, setUniqueNiches] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch influencers
  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/influencers");
      if (response.ok) {
        const data = await response.json();
        setInfluencers(data);
        setFilteredInfluencers(data);
        
        // Extract unique niches
        const niches = Array.from(
          new Set(data.map((i: Influencer) => i.niche).filter(Boolean))
        ) as string[];
        setUniqueNiches(niches.sort());
      }
    } catch (error) {
      console.error("Error fetching influencers:", error);
      alert("Failed to fetch influencers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...influencers];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (inf) =>
          inf.name.toLowerCase().includes(searchLower) ||
          inf.username.toLowerCase().includes(searchLower) ||
          inf.tag?.toLowerCase().includes(searchLower) ||
          inf.niche?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.tier && filters.tier !== "all") {
      filtered = filtered.filter((inf) => inf.tier === filters.tier);
    }

    if (filters.niche && filters.niche !== "all") {
      filtered = filtered.filter((inf) => inf.niche === filters.niche);
    }

    setFilteredInfluencers(filtered);
  }, [filters, influencers]);

  // CRUD handlers
  const handleCreate = async (data: CreateInfluencerDto) => {
    try {
      const response = await fetch("/api/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create influencer");
      }

      await fetchInfluencers();
    } catch (error) {
      console.error("Error creating influencer:", error);
      throw error;
    }
  };

  const handleUpdate = async (id: number, data: UpdateInfluencerDto) => {
    try {
      const response = await fetch(`/api/influencers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update influencer");
      }

      await fetchInfluencers();
    } catch (error) {
      console.error("Error updating influencer:", error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/influencers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete influencer");
      }

      await fetchInfluencers();
    } catch (error) {
      console.error("Error deleting influencer:", error);
      throw error;
    }
  };

  // CSV Export
  const handleExport = () => {
    const headers = [
      "Name",
      "Username",
      "Tag",
      "Niche",
      "TikTok Followers",
      "Facebook Followers",
      "Instagram Followers",
      "Tier",
      "Content Style",
      "Avg Views",
      "Contact",
      "Notes",
    ];

    const rows = filteredInfluencers.map((inf) => [
      inf.name,
      inf.username,
      inf.tag || "",
      inf.niche || "",
      inf.tiktokFollowers || "",
      inf.facebookFollowers || "",
      inf.instagramFollowers || "",
      inf.tier || "",
      inf.contentStyle || "",
      inf.avgViews || "",
      inf.contact || "",
      inf.notes || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `influencers_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          const row: any = {};

          headers.forEach((header, index) => {
            const value = values[index]?.trim();
            
            // Map CSV headers to field names
            if (header.includes("name") && !header.includes("user")) {
              row.name = value;
            } else if (header.includes("username")) {
              row.username = value;
            } else if (header.includes("tag")) {
              row.tag = value;
            } else if (header.includes("niche")) {
              row.niche = value;
            } else if (header.includes("tiktok")) {
              row.tiktokFollowers = value;
            } else if (header.includes("facebook")) {
              row.facebookFollowers = value;
            } else if (header.includes("instagram")) {
              row.instagramFollowers = value;
            } else if (header.includes("tier")) {
              row.tier = value;
            } else if (header.includes("content") || header.includes("style")) {
              row.contentStyle = value;
            } else if (header.includes("views") || header.includes("avg")) {
              row.avgViews = value;
            } else if (header.includes("contact")) {
              row.contact = value;
            } else if (header.includes("notes")) {
              row.notes = value;
            }
          });

          return row;
        });

        // Send to API
        const response = await fetch("/api/influencers/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(
            `Import complete!\nSuccess: ${result.success}\nFailed: ${result.failed}${
              result.errors.length > 0
                ? "\n\nErrors:\n" + result.errors.slice(0, 5).join("\n")
                : ""
            }`
          );
          await fetchInfluencers();
        } else {
          throw new Error("Import failed");
        }
      } catch (error) {
        console.error("Error importing CSV:", error);
        alert("Failed to import CSV. Please check the file format.");
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: "var(--card-foreground)" }}
        >
          Influencer Master List
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Manage your influencer database with search, filter, and bulk import
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "var(--muted)" }}
            />
            <input
              type="text"
              placeholder="Search by name, username, tag, or niche..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                color: "var(--card-foreground)",
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: showFilters ? "var(--primary)" : "var(--secondary)",
                color: showFilters ? "var(--primary-foreground)" : "var(--card-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              <FunnelIcon className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: "var(--secondary)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              }}
              title="Export to CSV"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Export
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2"
              style={{
                background: "var(--secondary)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              }}
              title="Import from CSV"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Import
            </button>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div
            className="p-4 rounded-lg border grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--card-foreground)" }}
              >
                Tier
              </label>
              <select
                value={filters.tier}
                onChange={(e) =>
                  setFilters({ ...filters, tier: e.target.value as Tier | "all" })
                }
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--card-foreground)",
                }}
              >
                <option value="all">All Tiers</option>
                <option value="A">Tier A</option>
                <option value="B">Tier B</option>
                <option value="C">Tier C</option>
                <option value="D">Tier D</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--card-foreground)" }}
              >
                Niche
              </label>
              <select
                value={filters.niche}
                onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  color: "var(--card-foreground)",
                }}
              >
                <option value="all">All Niches</option>
                {uniqueNiches.map((niche) => (
                  <option key={niche} value={niche}>
                    {niche}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div
          className="px-4 py-2 rounded-lg"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Total:{" "}
          </span>
          <span className="font-semibold" style={{ color: "var(--card-foreground)" }}>
            {influencers.length}
          </span>
        </div>
        <div
          className="px-4 py-2 rounded-lg"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            Filtered:{" "}
          </span>
          <span className="font-semibold" style={{ color: "var(--card-foreground)" }}>
            {filteredInfluencers.length}
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--primary)" }}
          />
        </div>
      ) : (
        <InfluencerTable
          influencers={filteredInfluencers}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
