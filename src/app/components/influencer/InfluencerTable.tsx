// src/app/components/influencer/InfluencerTable.tsx
"use client";

import React, { useState } from "react";
import {
  Influencer,
  InfluencerTableRow,
  Tier,
  CreateInfluencerDto,
  UpdateInfluencerDto,
} from "@/app/types/influencer.types";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface InfluencerTableProps {
  influencers: Influencer[];
  onUpdate: (id: number, data: UpdateInfluencerDto) => Promise<void>;
  onCreate: (data: CreateInfluencerDto) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function InfluencerTable({
  influencers,
  onUpdate,
  onCreate,
  onDelete,
}: InfluencerTableProps) {
  const [rows, setRows] = useState<InfluencerTableRow[]>(influencers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newRow, setNewRow] = useState<Partial<InfluencerTableRow> | null>(
    null
  );

  // Update rows when influencers prop changes
  React.useEffect(() => {
    setRows(influencers);
  }, [influencers]);

  const handleEdit = (id: number) => {
    setEditingId(id);
    setNewRow(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setRows(influencers);
  };

  const handleSaveEdit = async (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    try {
      const updateData: UpdateInfluencerDto = {
        name: row.name,
        username: row.username,
        tag: row.tag || undefined,
        niche: row.niche || undefined,
        tiktokFollowers: row.tiktokFollowers || undefined,
        facebookFollowers: row.facebookFollowers || undefined,
        instagramFollowers: row.instagramFollowers || undefined,
        tier: row.tier || undefined,
        contentStyle: row.contentStyle || undefined,
        avgViews: row.avgViews || undefined,
        contact: row.contact || undefined,
        notes: row.notes || undefined,
      };

      await onUpdate(id, updateData);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating influencer:", error);
      alert("Failed to update influencer");
      setRows(influencers);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this influencer?")) return;

    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting influencer:", error);
      alert("Failed to delete influencer");
    }
  };

  const handleAddNew = () => {
    setNewRow({
      name: "",
      username: "",
      tag: "",
      niche: "",
      tiktokFollowers: "",
      facebookFollowers: "",
      instagramFollowers: "",
      tier: null,
      contentStyle: "",
      avgViews: "",
      contact: "",
      notes: "",
    });
    setEditingId(null);
  };

  const handleCancelNew = () => {
    setNewRow(null);
  };

  const handleSaveNew = async () => {
    if (!newRow || !newRow.name) {
      alert("Name is required");
      return;
    }

    try {
      const createData: CreateInfluencerDto = {
        name: newRow.name,
        username: newRow.username,
        tag: newRow.tag || undefined,
        niche: newRow.niche || undefined,
        tiktokFollowers: newRow.tiktokFollowers || undefined,
        facebookFollowers: newRow.facebookFollowers || undefined,
        instagramFollowers: newRow.instagramFollowers || undefined,
        tier: newRow.tier || undefined,
        contentStyle: newRow.contentStyle || undefined,
        avgViews: newRow.avgViews || undefined,
        contact: newRow.contact || undefined,
        notes: newRow.notes || undefined,
      };

      await onCreate(createData);
      setNewRow(null);
    } catch (error) {
      console.error("Error creating influencer:", error);
      alert("Failed to create influencer");
    }
  };

  const updateRowField = (
    id: number,
    field: keyof Influencer,
    value: string | Tier | null
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const updateNewRowField = (
    field: keyof Influencer,
    value: string | Tier | null
  ) => {
    setNewRow((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  return (
    <div className="space-y-4">
      {/* Add New Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAddNew}
          disabled={newRow !== null}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: newRow ? "var(--muted)" : "var(--primary)",
            color: "var(--primary-foreground)",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (!newRow) {
              e.currentTarget.style.opacity = "0.9";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          + Add New Influencer
        </button>
      </div>

      {/* Table Container - Responsive with horizontal scroll */}
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full min-w-[1200px]">
          <thead style={{ background: "var(--secondary)" }}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Username</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Tag</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Niche</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>TikTok</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Facebook</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Instagram</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Tier</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Content Style</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Avg Views</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>Notes</th>
              <th className="px-4 py-3 text-center text-xs font-semibold w-32" style={{ color: "var(--card-foreground)" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* New Row Form */}
            {newRow && (
              <tr style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.name || ""}
                    onChange={(e) => updateNewRowField("name", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                    placeholder="Name *"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.username || ""}
                    onChange={(e) => updateNewRowField("username", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                    placeholder="Username"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.tag || ""}
                    onChange={(e) => updateNewRowField("tag", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.niche || ""}
                    onChange={(e) => updateNewRowField("niche", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.tiktokFollowers || ""}
                    onChange={(e) => updateNewRowField("tiktokFollowers", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                    placeholder="e.g. 34.3K"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.facebookFollowers || ""}
                    onChange={(e) => updateNewRowField("facebookFollowers", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.instagramFollowers || ""}
                    onChange={(e) => updateNewRowField("instagramFollowers", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    value={newRow.tier || ""}
                    onChange={(e) => updateNewRowField("tier", e.target.value as Tier || null)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  >
                    <option value="">-</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.contentStyle || ""}
                    onChange={(e) => updateNewRowField("contentStyle", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.avgViews || ""}
                    onChange={(e) => updateNewRowField("avgViews", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.contact || ""}
                    onChange={(e) => updateNewRowField("contact", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={newRow.notes || ""}
                    onChange={(e) => updateNewRowField("notes", e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleSaveNew}
                      className="p-1 rounded transition-colors"
                      style={{ color: "var(--success)" }}
                      title="Save"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelNew}
                      className="p-1 rounded transition-colors"
                      style={{ color: "var(--danger)" }}
                      title="Cancel"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Existing Rows */}
            {rows.map((row) => {
              const isEditing = editingId === row.id;

              return (
                <tr
                  key={row.id}
                  style={{
                    background: isEditing ? "var(--secondary)" : "var(--card)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRowField(row.id, "name", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--card-foreground)" }}>{row.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.username}
                        onChange={(e) => updateRowField(row.id, "username", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--card-foreground)" }}>{row.username}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.tag || ""}
                        onChange={(e) => updateRowField(row.id, "tag", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.tag || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.niche || ""}
                        onChange={(e) => updateRowField(row.id, "niche", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.niche || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.tiktokFollowers || ""}
                        onChange={(e) => updateRowField(row.id, "tiktokFollowers", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.tiktokFollowers || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.facebookFollowers || ""}
                        onChange={(e) => updateRowField(row.id, "facebookFollowers", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.facebookFollowers || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.instagramFollowers || ""}
                        onChange={(e) => updateRowField(row.id, "instagramFollowers", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.instagramFollowers || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <select
                        value={row.tier || ""}
                        onChange={(e) => updateRowField(row.id, "tier", e.target.value as Tier || null)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      >
                        <option value="">-</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    ) : (
                      <span
                        className="text-sm font-medium px-2 py-1 rounded"
                        style={{
                          background: row.tier
                            ? row.tier === "A"
                              ? "rgba(16, 185, 129, 0.1)"
                              : row.tier === "B"
                              ? "rgba(59, 130, 246, 0.1)"
                              : row.tier === "C"
                              ? "rgba(245, 158, 11, 0.1)"
                              : "rgba(239, 68, 68, 0.1)"
                            : "transparent",
                          color: row.tier
                            ? row.tier === "A"
                              ? "var(--success)"
                              : row.tier === "B"
                              ? "var(--primary)"
                              : row.tier === "C"
                              ? "var(--warning)"
                              : "var(--danger)"
                            : "var(--muted)",
                        }}
                      >
                        {row.tier || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.contentStyle || ""}
                        onChange={(e) => updateRowField(row.id, "contentStyle", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.contentStyle || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.avgViews || ""}
                        onChange={(e) => updateRowField(row.id, "avgViews", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.avgViews || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.contact || ""}
                        onChange={(e) => updateRowField(row.id, "contact", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.contact || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={row.notes || ""}
                        onChange={(e) => updateRowField(row.id, "notes", e.target.value)}
                        className="w-full px-2 py-1 text-sm rounded border"
                        style={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          color: "var(--card-foreground)",
                        }}
                      />
                    ) : (
                      <span className="text-sm truncate max-w-[150px] block" style={{ color: "var(--muted)" }}>
                        {row.notes || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(row.id)}
                            className="p-1 rounded transition-colors hover:bg-green-100"
                            style={{ color: "var(--success)" }}
                            title="Save"
                          >
                            <CheckIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 rounded transition-colors hover:bg-red-100"
                            style={{ color: "var(--danger)" }}
                            title="Cancel"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(row.id)}
                            className="p-1 rounded transition-colors hover:bg-blue-100"
                            style={{ color: "var(--primary)" }}
                            title="Edit"
                            disabled={newRow !== null}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1 rounded transition-colors hover:bg-red-100"
                            style={{ color: "var(--danger)" }}
                            title="Delete"
                            disabled={newRow !== null || isEditing}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
