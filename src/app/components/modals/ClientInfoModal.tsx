"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Client } from "../../types";
import { useClientManagement } from "../../hooks";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EditableField } from "../client/EditableField";
import { EditableTagField } from "../client/EditableTagField";
import { BrandAssetsSection } from "../client/BrandAssetsSection";
import { PencilSquareIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface ClientInfoModalProps {
  client: Client;
}

export function ClientInfoModal({ client }: ClientInfoModalProps) {
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
    <div className="bg-[#23262F] w-full">
      {/* Header */}
      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <button
                className="bg-[#ff2929] text-[#F1F5F9] border-none rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer"
                onClick={handleCancel}
                disabled={saving}
              >
                <XCircleIcon className="w-4 h-4 text-[#F1F5F9]" /> Cancel
              </button>
              <button
                className={`${
                  saving ? "bg-[#94A3B8] opacity-70 cursor-not-allowed" : "bg-[#10b981] cursor-pointer"
                } text-[#F1F5F9] border-none rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center transition-colors`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span
                      className="inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      style={{ verticalAlign: "middle" }}
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-4 h-4 text-[#F1F5F9]" />
                    <span className="ml-1">Save Changes</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              className="bg-[#2563eb] text-[#F1F5F9] border-none rounded-lg px-4 py-2 text-sm font-semibold flex items-center justify-center transition-colors cursor-pointer hover:bg-[#1E40AF]"
              onClick={() => setEditing(true)}
            >
              <PencilSquareIcon className="w-4 h-4 text-[#F1F5F9]" /> Edit Info
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-[#ef444420] border border-[#ef444440] rounded-lg p-3 mb-5 text-[#ef4444] text-sm">
          {error}
        </div>
      )}

      {/* Saving Overlay */}
      {saving && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center z-10">
          <LoadingSpinner size="large" text="Saving changes..." />
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] w-full">
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
