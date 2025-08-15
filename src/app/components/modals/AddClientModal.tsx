// components/modals/AddClientModal.tsx
import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { NewClientForm } from "../../types";
import { COLORS, UI_CONFIG, INITIAL_FORM_STATE } from "../../constants";
import { useFileUpload } from "../../hooks";
import { Modal, FormField } from "../ui";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (client: NewClientForm) => void;
}

export function AddClientModal({
  isOpen,
  onClose,
  onSubmit,
}: AddClientModalProps) {
  const [formData, setFormData] = useState<NewClientForm>(INITIAL_FORM_STATE);
  const { handleFileUpload } = useFileUpload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(INITIAL_FORM_STATE);
    onClose();
  };

  const updateFormField = (field: keyof NewClientForm) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Client">
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: UI_CONFIG.FORM_GAP,
        }}
      >
        <LogoUploadSection
          formData={formData}
          setFormData={setFormData}
          handleFileUpload={handleFileUpload}
          updateFormField={updateFormField}
        />

        <BasicInfoSection
          formData={formData}
          updateFormField={updateFormField}
        />

        <DescriptionSection
          formData={formData}
          updateFormField={updateFormField}
        />

        <BusinessDetailsSection
          formData={formData}
          updateFormField={updateFormField}
        />

        <CompetitionSection
          formData={formData}
          updateFormField={updateFormField}
        />

        <BrandingSection
          formData={formData}
          setFormData={setFormData}
          handleFileUpload={handleFileUpload}
          updateFormField={updateFormField}
        />

        <FormActions onCancel={handleClose} />
      </form>
    </Modal>
  );
}

// Section Components
interface SectionProps {
  formData: NewClientForm;
  updateFormField: (field: keyof NewClientForm) => (value: string) => void;
}

interface LogoSectionProps extends SectionProps {
  setFormData: React.Dispatch<React.SetStateAction<NewClientForm>>;
  handleFileUpload: (
    file: File | null,
    setFormData: React.Dispatch<React.SetStateAction<NewClientForm>>,
    fieldName: "logo" | "brandGuideFile" | "brandColorsFile"
  ) => void;
}

function LogoUploadSection({
  formData,
  setFormData,
  handleFileUpload,
  updateFormField,
}: LogoSectionProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: UI_CONFIG.FORM_GAP,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 80,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: COLORS.muted,
            overflow: "hidden",
            marginBottom: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {formData.logoUrl ? (
            <img
              src={formData.logoUrl}
              alt="Logo Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <UserIcon width={36} height={36} color={COLORS.bg} />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          id="client-logo-upload"
          onChange={(e) =>
            handleFileUpload(e.target.files?.[0] || null, setFormData, "logo")
          }
        />
        <label
          htmlFor="client-logo-upload"
          style={{
            fontSize: 13,
            color: COLORS.text,
            background: COLORS.accent,
            border: `1px solid ${COLORS.accent}`,
            borderRadius: UI_CONFIG.BORDER_RADIUS.SMALL,
            padding: "4px 12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Upload Logo
        </label>
      </div>

      <FormField
        placeholder="Business Name"
        value={formData.name}
        onChange={updateFormField("name")}
        required
        style={{ flex: 2, minWidth: 220 }}
      />

      <FormField
        placeholder="Business Address"
        value={formData.info}
        onChange={updateFormField("info")}
        required
        style={{ flex: 3, minWidth: 220 }}
      />
    </div>
  );
}

function BasicInfoSection({ formData, updateFormField }: SectionProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: UI_CONFIG.FORM_GAP,
        flexWrap: "wrap",
      }}
    >
      <FormField
        placeholder="Industry"
        value={formData.industry}
        onChange={updateFormField("industry")}
        required
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Links (comma separated)"
        value={formData.links}
        onChange={updateFormField("links")}
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Niche"
        value={formData.niche}
        onChange={updateFormField("niche")}
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Business Age"
        value={formData.businessAge}
        onChange={updateFormField("businessAge")}
        style={{ flex: 1, minWidth: 220 }}
      />
    </div>
  );
}

function DescriptionSection({ formData, updateFormField }: SectionProps) {
  return (
    <FormField
      placeholder="Short Description"
      value={formData.description}
      onChange={updateFormField("description")}
      multiline
    />
  );
}

function BusinessDetailsSection({ formData, updateFormField }: SectionProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: UI_CONFIG.FORM_GAP,
        flexWrap: "wrap",
      }}
    >
      <FormField
        placeholder="Core Products/Services (comma separated)"
        value={formData.coreProducts}
        onChange={updateFormField("coreProducts")}
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Ideal Customer"
        value={formData.idealCustomer}
        onChange={updateFormField("idealCustomer")}
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Desired Brand Emotion"
        value={formData.brandEmotion}
        onChange={updateFormField("brandEmotion")}
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Unique Selling Proposition"
        value={formData.uniqueSelling}
        onChange={updateFormField("uniqueSelling")}
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Main Social Media Goal"
        value={formData.mainGoal}
        onChange={updateFormField("mainGoal")}
        style={{ flex: 1, minWidth: 220 }}
      />
    </div>
  );
}

function CompetitionSection({ formData, updateFormField }: SectionProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: UI_CONFIG.FORM_GAP,
        flexWrap: "wrap",
      }}
    >
      <FormField
        placeholder="Competitors (comma separated)"
        value={formData.competitors}
        onChange={updateFormField("competitors")}
        style={{ flex: 1, minWidth: 220 }}
      />
      <FormField
        placeholder="Inspiration Businesses (comma separated)"
        value={formData.inspo}
        onChange={updateFormField("inspo")}
        style={{ flex: 1, minWidth: 220 }}
      />
    </div>
  );
}

function BrandingSection({
  formData,
  setFormData,
  handleFileUpload,
  updateFormField,
}: LogoSectionProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: UI_CONFIG.FORM_GAP,
        flexWrap: "wrap",
      }}
    >
      <FormField
        placeholder="Brand Colors (e.g. #2563eb, #181A20)"
        value={formData.brandColors}
        onChange={updateFormField("brandColors")}
        style={{ flex: 1, minWidth: 220 }}
      />

      <div
        style={{
          flex: 1,
          minWidth: 220,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="file"
            accept="image/*,application/pdf"
            id="brand-guide-upload"
            style={{ display: "none" }}
            onChange={(e) =>
              handleFileUpload(
                e.target.files?.[0] || null,
                setFormData,
                "brandGuideFile"
              )
            }
          />
          <label
            htmlFor="brand-guide-upload"
            style={{
              fontSize: 13,
              color: COLORS.text,
              background: COLORS.accent,
              border: `1px solid ${COLORS.accent}`,
              borderRadius: UI_CONFIG.BORDER_RADIUS.SMALL,
              padding: "4px 12px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Upload Brand Guide
          </label>
          {formData.brandGuideFileUrl && (
            <a
              href={formData.brandGuideFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: COLORS.accent, fontSize: 13 }}
            >
              Preview
            </a>
          )}
        </div>
      </div>

      <FormField
        placeholder="Font Used"
        value={formData.fontUsed}
        onChange={updateFormField("fontUsed")}
        style={{ flex: 1, minWidth: 220 }}
      />
    </div>
  );
}

function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        marginTop: 10,
        justifyContent: "flex-end",
      }}
    >
      <button
        type="submit"
        style={{
          background: COLORS.accent,
          color: COLORS.text,
          border: "none",
          borderRadius: UI_CONFIG.BORDER_RADIUS.MEDIUM,
          padding: "10px 24px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        Add Client
      </button>
      <button
        type="button"
        onClick={onCancel}
        style={{
          background: COLORS.card,
          color: COLORS.text,
          border: `1px solid ${COLORS.border}`,
          borderRadius: UI_CONFIG.BORDER_RADIUS.MEDIUM,
          padding: "10px 24px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 15,
        }}
      >
        Cancel
      </button>
    </div>
  );
}
