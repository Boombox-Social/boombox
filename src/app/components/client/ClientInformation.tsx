"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Client } from "../../types";
import { useClientManagement } from "../../hooks";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EditableField } from "./EditableField";
import { EditableTagField } from "./EditableTagField";
import { BrandAssetsSection } from "./BrandAssetsSection";

const colors = {
  bg: "#181A20",
  side: "#23262F",
  card: "#23262F",
  accent: "#2563eb",
  text: "#F1F5F9",
  muted: "#94A3B8",
  border: "#2D3142",
  hover: "#1E40AF",
  success: "#10b981",
  error: "#ef4444",
};

interface ClientInformationProps {
  client: Client;
}

export function ClientInformation({ client }: ClientInformationProps) {
  const { updateClient } = useClientManagement();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const getInitialFormData = useCallback(
    () => ({
      industry: client?.industry ?? "",
      slogan: client?.slogan ?? "",
      links: client?.links ?? [],
      coreProducts: client?.coreProducts ?? [],
      idealCustomers: client?.idealCustomers ?? "",
      brandEmotion: client?.brandEmotion ?? "",
      uniqueProposition: client?.uniqueProposition ?? "",
      whyChooseUs: client?.whyChooseUs ?? "",
      mainGoal: client?.mainGoal ?? "",
      shortTermGoal: client?.shortTermGoal ?? "",
      longTermGoal: client?.longTermGoal ?? "",
      competitors: client?.competitors ?? [],
      indirectCompetitors: client?.indirectCompetitors ?? [],
      brandAssets: client?.brandAssets ?? [],
      fontUsed: client?.fontUsed ?? [],
      smmDriveLink: client?.smmDriveLink ?? "",
      contractDeliverables: client?.contractDeliverables ?? "",
    }),
    [client] // Add client to dependency array
  );

  const [originalFormData, setOriginalFormData] = useState(getInitialFormData);
  const [formData, setFormData] = useState(getInitialFormData);

  // Update form data when client changes - add client to dependency array
  useEffect(() => {
    if (client) {
      const newFormData = getInitialFormData();
      setFormData(newFormData);
      setOriginalFormData(newFormData);
      setEditing(false);
      setError("");
    }
  }, [client, getInitialFormData]); // Add client and getInitialFormData

  const handleSave = useCallback(async () => {
    if (!client?.id) return;

    setSaving(true);
    setError("");

    try {
      const updatedClient = {
        ...client,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      await updateClient(updatedClient);
      setOriginalFormData(formData);
      setEditing(false);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error updating client:", error);
      }
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update client. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }, [client, formData, updateClient]);

  const handleCancel = useCallback(() => {
    setFormData(originalFormData);
    setEditing(false);
    setError("");
  }, [originalFormData]);

  const updateField = useCallback(
    (field: string) => (value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user makes changes
      if (error) setError("");
    },
    [error]
  );

  return (
    <div
      style={{
        background: colors.card,
        borderRadius: 16,
        padding: 24,
        gridColumn: 1,
        gridRow: 2,
        minWidth: 0,
        minHeight: 0,
        overflowY: "auto",
        maxHeight: "calc(100vh - 200px)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 24, color: colors.text }}>
          Business Information
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {editing ? (
            <>
              <button
                style={{
                  background: colors.border,
                  color: colors.text,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                  fontWeight: 600,
                }}
                onClick={handleCancel}
                disabled={saving}
              >
                ❌ Cancel
              </button>
              <button
                style={{
                  background: saving ? colors.muted : colors.success,
                  color: colors.text,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 14,
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                  fontWeight: 600,
                  opacity: saving ? 0.7 : 1,
                }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid white",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: 8,
                      }}
                    />
                    Saving...
                  </>
                ) : (
                  "💾 Save Changes"
                )}
              </button>
            </>
          ) : (
            <button
              style={{
                background: colors.accent,
                color: colors.text,
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                fontWeight: 600,
              }}
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Info
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            background: `${colors.error}20`,
            border: `1px solid ${colors.error}40`,
            borderRadius: 8,
            padding: 12,
            marginBottom: 20,
            color: colors.error,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Saving Overlay */}
      {saving && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <LoadingSpinner size="large" text="Saving changes..." />
        </div>
      )}

      {/* Grid Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {/* Basic Info */}
        <EditableField
          label="Industry"
          value={formData.industry}
          fallback={client.industry}
          editing={editing}
          onChange={updateField("industry")}
        />

        <EditableField
          label="Slogan"
          value={formData.slogan}
          fallback={client.slogan}
          editing={editing}
          onChange={updateField("slogan")}
        />

        {/* Links */}
        <EditableTagField
          label="Social Media & Website Links"
          value={formData.links}
          fallback={client.links}
          editing={editing}
          onChange={updateField("links")}
          isLink={true}
          gridColumn="1 / -1"
        />

        {/* Core Products */}
        <EditableTagField
          label="Core Products/Services"
          value={formData.coreProducts}
          fallback={client.coreProducts}
          editing={editing}
          onChange={updateField("coreProducts")}
          gridColumn="1 / -1"
        />

        {/* Strategy Fields */}
        <EditableField
          label="Ideal Customers"
          value={formData.idealCustomers}
          fallback={client.idealCustomers}
          editing={editing}
          onChange={updateField("idealCustomers")}
          multiline
        />

        <EditableField
          label="Brand Emotion"
          value={formData.brandEmotion}
          fallback={client.brandEmotion}
          editing={editing}
          onChange={updateField("brandEmotion")}
        />

        <EditableField
          label="Unique Value Proposition"
          value={formData.uniqueProposition}
          fallback={client.uniqueProposition}
          editing={editing}
          onChange={updateField("uniqueProposition")}
          multiline
          gridColumn="1 / -1"
        />

        <EditableField
          label="Why Choose Us"
          value={formData.whyChooseUs}
          fallback={client.whyChooseUs}
          editing={editing}
          onChange={updateField("whyChooseUs")}
          multiline
          gridColumn="1 / -1"
        />

        {/* Goals */}
        <EditableField
          label="Main Goal"
          value={formData.mainGoal}
          fallback={client.mainGoal}
          editing={editing}
          onChange={updateField("mainGoal")}
        />

        <EditableField
          label="Short Term Goal"
          value={formData.shortTermGoal}
          fallback={client.shortTermGoal}
          editing={editing}
          onChange={updateField("shortTermGoal")}
        />

        <EditableField
          label="Long Term Goal"
          value={formData.longTermGoal}
          fallback={client.longTermGoal}
          editing={editing}
          onChange={updateField("longTermGoal")}
        />

        {/* Competition */}
        <EditableTagField
          label="Direct Competitors"
          value={formData.competitors}
          fallback={client.competitors}
          editing={editing}
          onChange={updateField("competitors")}
          gridColumn="1 / -1"
        />

        <EditableTagField
          label="Indirect Competitors"
          value={formData.indirectCompetitors}
          fallback={client.indirectCompetitors}
          editing={editing}
          onChange={updateField("indirectCompetitors")}
          gridColumn="1 / -1"
        />

        {/* Brand Assets - Updated to pass value and onChange */}
        <BrandAssetsSection
          client={client}
          editing={editing}
          value={formData.brandAssets}
          onChange={updateField("brandAssets")}
        />

        {/* Fonts - Updated to use EditableTagField for font names */}
        <EditableTagField
          label="Fonts Used"
          value={formData.fontUsed}
          fallback={client.fontUsed}
          editing={editing}
          onChange={updateField("fontUsed")}
          gridColumn="1 / -1"
        />

        {/* Additional Fields */}
        <EditableField
          label="SMM Drive Link"
          value={formData.smmDriveLink}
          fallback={client.smmDriveLink}
          editing={editing}
          onChange={updateField("smmDriveLink")}
        />

        <EditableField
          label="Contract Deliverables"
          value={formData.contractDeliverables}
          fallback={client.contractDeliverables}
          editing={editing}
          onChange={updateField("contractDeliverables")}
          multiline
          gridColumn="1 / -1"
        />
      </div>

      {/* Add spinning animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
