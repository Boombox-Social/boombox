"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Client } from "../../types";
import { useClientManagement } from "../../hooks";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EditableField } from "../client/EditableField";
import { EditableTagField } from "../client/EditableTagField";
import { BrandAssetsSection } from "../client/BrandAssetsSection";
import { PencilSquareIcon, CheckCircleIcon, XCircleIcon, BookmarkIcon } from "@heroicons/react/24/solid";

// ─── Per-client session draft helpers ─────────────────────────────────────────
function draftKey(clientId: number) {
  return `client-info-draft-${clientId}`;
}

type ClientFormData = ReturnType<typeof buildInitialFormData>;

function buildInitialFormData(client: Client) {
  return {
    name: client?.name ?? "",
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
  };
}

function loadClientDraft(clientId: number): ClientFormData | null {
  try {
    const raw = sessionStorage.getItem(draftKey(clientId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveClientDraft(clientId: number, data: ClientFormData): void {
  try {
    sessionStorage.setItem(draftKey(clientId), JSON.stringify(data));
  } catch {
    // Quota exceeded — fail silently
  }
}

function clearClientDraft(clientId: number): void {
  sessionStorage.removeItem(draftKey(clientId));
}

interface ClientInfoModalProps {
  client: Client;
}

export function ClientInfoModal({ client }: ClientInfoModalProps) {
  const { updateClient } = useClientManagement();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasDraft, setHasDraft] = useState(false);

  const getInitialFormData = useCallback(
    () => buildInitialFormData(client),
    [client]
  );

  const [originalFormData, setOriginalFormData] = useState(getInitialFormData);
  const [formData, setFormData] = useState(getInitialFormData);

  // On client change: reset form, then check for a saved draft
  useEffect(() => {
    if (client) {
      const fresh = getInitialFormData();
      setOriginalFormData(fresh);
      setEditing(false);
      setError("");

      const draft = loadClientDraft(client.id);
      if (draft) {
        setFormData(draft);
        setHasDraft(true);
      } else {
        setFormData(fresh);
        setHasDraft(false);
      }
    }
  }, [client, getInitialFormData]);

  // Auto-save to session whenever formData changes while editing
  useEffect(() => {
    if (editing && client?.id) {
      saveClientDraft(client.id, formData);
    }
  }, [formData, editing, client?.id]);

  const handleRestoreDraft = () => {
    // Draft is already applied in state; just dismiss the banner and enter edit mode
    setHasDraft(false);
    setEditing(true);
  };

  const handleDiscardDraft = useCallback(() => {
    if (client?.id) clearClientDraft(client.id);
    setFormData(originalFormData);
    setHasDraft(false);
    setEditing(false);
  }, [client?.id, originalFormData]);

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
      clearClientDraft(client.id);
      setOriginalFormData(formData);
      setEditing(false);
      setHasDraft(false);
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
    if (client?.id) clearClientDraft(client.id);
    setFormData(originalFormData);
    setEditing(false);
    setError("");
    setHasDraft(false);
  }, [client?.id, originalFormData]);

  const updateField = useCallback(
    (field: string) => (value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) setError("");
    },
    [error]
  );

  return (
    <div className="w-full relative">
      {/* Unsaved Draft Banner */}
      {hasDraft && !editing && (
        <div
          className="flex items-center justify-between mb-4 px-4 py-3 rounded-lg"
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
          }}
        >
          <div className="flex items-center space-x-2">
            <BookmarkIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B" }} />
            <p className="text-sm font-medium" style={{ color: "#B45309" }}>
              You have unsaved changes from a previous session.
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="text-xs font-medium px-3 py-1 rounded transition-all duration-200"
              style={{ color: "var(--muted)", background: "transparent", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--secondary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="text-xs font-medium px-3 py-1 rounded transition-all duration-200"
              style={{ color: "var(--primary-foreground)", background: "var(--primary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1E40AF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--primary)"; }}
            >
              Resume editing
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-end mb-6">
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  background: "transparent",
                  color: "var(--card-foreground)",
                  border: "2px solid var(--border)",
                }}
                onClick={handleCancel}
                disabled={saving}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <XCircleIcon className="w-4 h-4" />
                Cancel
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  saving ? "opacity-60 cursor-not-allowed" : ""
                }`}
                style={{
                  background: "var(--success)",
                  color: "#ffffff",
                }}
                onClick={handleSave}
                disabled={saving}
                onMouseEnter={(e) => {
                  if (!saving) e.currentTarget.style.background = "#059669";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--success)";
                }}
              >
                {saving ? (
                  <>
                    <div 
                      className="w-4 h-4 rounded-full animate-spin"
                      style={{
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        borderTopColor: "#ffffff",
                      }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
              onClick={() => setEditing(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1E40AF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
              }}
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Info
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div 
          className="rounded-md p-3 mb-5 text-sm flex items-start gap-2"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "var(--danger)",
          }}
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Saving Overlay */}
      {saving && (
        <div 
          className="absolute inset-0 rounded-lg flex items-center justify-center z-10"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <LoadingSpinner size="large" text="Saving changes..." />
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Client Name */}
        <div className="md:col-span-2 lg:col-span-3">
          <EditableField
            label="Client Name"
            value={formData.name}
            fallback={client.name}
            editing={editing}
            onChange={updateField("name")}
          />
        </div>

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
        <div className="md:col-span-2 lg:col-span-3">
          <EditableTagField
            label="Social Media & Website Links"
            value={formData.links}
            fallback={client.links}
            editing={editing}
            onChange={updateField("links")}
            isLink={true}
          />
        </div>

        {/* Core Products */}
        <div className="md:col-span-2 lg:col-span-3">
          <EditableTagField
            label="Core Products/Services"
            value={formData.coreProducts}
            fallback={client.coreProducts}
            editing={editing}
            onChange={updateField("coreProducts")}
          />
        </div>

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

        <div className="md:col-span-2 lg:col-span-3">
          <EditableField
            label="Unique Value Proposition"
            value={formData.uniqueProposition}
            fallback={client.uniqueProposition}
            editing={editing}
            onChange={updateField("uniqueProposition")}
            multiline
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <EditableField
            label="Why Choose Us"
            value={formData.whyChooseUs}
            fallback={client.whyChooseUs}
            editing={editing}
            onChange={updateField("whyChooseUs")}
            multiline
          />
        </div>

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
        <div className="md:col-span-2 lg:col-span-3">
          <EditableTagField
            label="Direct Competitors"
            value={formData.competitors}
            fallback={client.competitors}
            editing={editing}
            onChange={updateField("competitors")}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <EditableTagField
            label="Indirect Competitors"
            value={formData.indirectCompetitors}
            fallback={client.indirectCompetitors}
            editing={editing}
            onChange={updateField("indirectCompetitors")}
          />
        </div>

        {/* Brand Assets */}
        <div className="md:col-span-2 lg:col-span-3">
          <BrandAssetsSection
            client={client}
            editing={editing}
            value={formData.brandAssets}
            onChange={updateField("brandAssets")}
          />
        </div>

        {/* Fonts */}
        <div className="md:col-span-2 lg:col-span-3">
          <EditableTagField
            label="Fonts Used"
            value={formData.fontUsed}
            fallback={client.fontUsed}
            editing={editing}
            onChange={updateField("fontUsed")}
          />
        </div>

        {/* Additional Fields */}
        <EditableField
          label="SMM Drive Link"
          value={formData.smmDriveLink}
          fallback={client.smmDriveLink}
          editing={editing}
          onChange={updateField("smmDriveLink")}
        />

        <div className="md:col-span-2 lg:col-span-3">
          <EditableField
            label="Contract Deliverables"
            value={formData.contractDeliverables}
            fallback={client.contractDeliverables}
            editing={editing}
            onChange={updateField("contractDeliverables")}
            multiline
          />
        </div>
      </div>
    </div>
  );
}