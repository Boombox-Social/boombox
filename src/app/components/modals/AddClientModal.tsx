"use client";
import React, { useState } from "react";
import {
  UserIcon,
  XMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/solid";
import {
  NewClientForm,
  arrayFieldToString,
  stringToArrayField,
} from "../../types";
import { INITIAL_FORM_STATE } from "../../constants";
import { Modal, FormField } from "../ui";
import { useAuth } from "../../hooks/useAuth";
import { UserAssignmentSelector } from "../client/UserAssignmentSelector";

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
  const { authState } = useAuth();
  const [formData, setFormData] = useState<NewClientForm>(INITIAL_FORM_STATE);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);

  const steps = [
    { title: "Basic Information", description: "Company details and logo" },
    {
      title: "Business Details",
      description: "Products, customers, and goals",
    },
    {
      title: "Competition & Branding",
      description: "Competitors and brand assets",
    },
  ];

  const canAssignSMMs =
    authState.user?.role === "ADMIN" || authState.user?.role === "SUPER_ADMIN";

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.name.trim()) newErrors.name = "Business name is required";
      if (!formData.industry.trim())
        newErrors.industry = "Industry is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const safeStringToArray = (
    value: string | string[] | undefined
  ): string[] => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === "string") {
      return stringToArrayField(value);
    }
    return [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setErrors({});

    try {
      const clientData: NewClientForm = {
        ...formData,
        logo: logoPreview || null,
        links: safeStringToArray(formData.links),
        coreProducts: safeStringToArray(formData.coreProducts),
        competitors: safeStringToArray(formData.competitors),
        indirectCompetitors: safeStringToArray(formData.indirectCompetitors),
        fontUsed: safeStringToArray(formData.fontUsed),
        brandAssets: Array.isArray(formData.brandAssets)
          ? formData.brandAssets
          : [],
        assignedUserIds: assignedUserIds,
      };

      await onSubmit(clientData);

      setFormData(INITIAL_FORM_STATE);
      setLogoPreview("");
      setCurrentStep(0);
      setAssignedUserIds([]);
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create client",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormField = (field: keyof NewClientForm) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    setLogoPreview("");
    setCurrentStep(0);
    setAssignedUserIds([]);
    setErrors({});
    onClose();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          logo: "Logo file must be smaller than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.logo;
          return newErrors;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="60em">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div 
          className="flex items-center justify-between mb-6 pb-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 
              className="text-2xl font-bold mb-1 tracking-tight"
              style={{ color: "var(--card-foreground)" }}
            >
              Add New Client
            </h2>
            <p 
              className="text-sm"
              style={{ color: "var(--muted)" }}
            >
              Create a new client profile for your portfolio
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <XMarkIcon 
              className="w-6 h-6" 
              style={{ color: "var(--muted)" }}
            />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200"
                  style={{
                    background: index <= currentStep ? "var(--primary)" : "var(--secondary)",
                    color: index <= currentStep ? "var(--primary-foreground)" : "var(--muted)",
                  }}
                >
                  {index + 1}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className="text-sm font-medium"
                    style={{ 
                      color: index <= currentStep ? "var(--card-foreground)" : "var(--muted)" 
                    }}
                  >
                    {step.title}
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-4 transition-all duration-200"
                  style={{
                    background: index < currentStep ? "var(--primary)" : "var(--border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}
          >
            <p 
              className="text-sm"
              style={{ color: "var(--danger)" }}
            >
              {errors.submit}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <LogoUploadSection
                logoPreview={logoPreview}
                onLogoUpload={handleLogoUpload}
                setLogoPreview={setLogoPreview}
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />

              <BasicInfoSection
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />

              {canAssignSMMs && (
                <AssignmentSection
                  assignedUserIds={assignedUserIds}
                  setAssignedUserIds={setAssignedUserIds}
                />
              )}
            </div>
          )}

          {/* Step 1: Business Details */}
          {currentStep === 1 && (
            <BusinessDetailsSection
              formData={formData}
              updateFormField={updateFormField}
              errors={errors}
            />
          )}

          {/* Step 2: Competition & Branding */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <CompetitionSection
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />

              <BrandingSection
                formData={formData}
                updateFormField={updateFormField}
                errors={errors}
              />
            </div>
          )}

          {/* Navigation */}
          <div 
            className="flex items-center justify-between pt-6 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--secondary)",
                color: "var(--card-foreground)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                if (currentStep !== 0) {
                  e.currentTarget.style.background = "var(--background)";
                }
              }}
              onMouseLeave={(e) => {
                if (currentStep !== 0) {
                  e.currentTarget.style.background = "var(--secondary)";
                }
              }}
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
                style={{
                  background: "var(--secondary)",
                  color: "var(--card-foreground)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--background)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--secondary)";
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.background = "#1E40AF";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                }}
              >
                {isLoading ? (
                  <>
                    <div 
                      className="w-4 h-4 rounded-full animate-spin"
                      style={{
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        borderTopColor: "#ffffff",
                      }}
                    />
                    <span>Creating...</span>
                  </>
                ) : currentStep < steps.length - 1 ? (
                  <>
                    <span>Next</span>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-5 h-5" />
                    <span>Create Client</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// SMM Assignment Section Component
interface AssignmentSectionProps {
  assignedUserIds: number[];
  setAssignedUserIds: React.Dispatch<React.SetStateAction<number[]>>;
}

function AssignmentSection({
  assignedUserIds,
  setAssignedUserIds,
}: AssignmentSectionProps) {
  return (
    <div className="space-y-4">
      <h3 
        className="text-lg font-semibold"
        style={{ color: "var(--card-foreground)" }}
      >
        SMM Assignment
      </h3>
      <p 
        className="text-sm"
        style={{ color: "var(--muted)" }}
      >
        Select which Social Media Managers should be assigned to this client.
        Leave empty to assign later.
      </p>

      <div 
        className="rounded-lg p-4"
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
        }}
      >
        <UserAssignmentSelector
          initialAssignedUserIds={assignedUserIds}
          onChange={setAssignedUserIds}
          canEdit={true}
        />
      </div>
    </div>
  );
}

// Section Components
interface SectionProps {
  formData: NewClientForm;
  updateFormField: (field: keyof NewClientForm) => (value: string) => void;
  errors: Record<string, string>;
}

interface LogoSectionProps extends SectionProps {
  logoPreview: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLogoPreview: React.Dispatch<React.SetStateAction<string>>;
}

function LogoUploadSection({
  logoPreview,
  onLogoUpload,
  setLogoPreview,
  formData,
  updateFormField,
  errors,
}: LogoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Logo Upload */}
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <div 
            className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-200"
            style={{
              background: "var(--background)",
              borderColor: "var(--border)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon 
                className="w-10 h-10" 
                style={{ color: "var(--muted)" }}
              />
            )}
          </div>
          {logoPreview && (
            <button
              type="button"
              onClick={() => setLogoPreview("")}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: "var(--danger)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#DC2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--danger)";
              }}
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="client-logo-upload"
          onChange={onLogoUpload}
        />
        <label
          htmlFor="client-logo-upload"
          className="px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1E40AF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--primary)";
          }}
        >
          Upload Logo
        </label>
        {errors.logo && (
          <p 
            className="text-xs text-center"
            style={{ color: "var(--danger)" }}
          >
            {errors.logo}
          </p>
        )}
      </div>

      {/* Business Name */}
      <div className="md:col-span-3 space-y-4">
        <FormField
          label="Business Name *"
          placeholder="Enter company name"
          value={formData.name}
          onChange={updateFormField("name")}
          error={errors.name}
          className="text-lg font-semibold"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Industry *"
            placeholder="e.g., Technology, Healthcare"
            value={formData.industry}
            onChange={updateFormField("industry")}
            error={errors.industry}
          />
          <FormField
            label="Business Address *"
            placeholder="City, Country"
            value={formData.address}
            onChange={updateFormField("address")}
            error={errors.address}
          />
        </div>
      </div>
    </div>
  );
}

function BasicInfoSection({ formData, updateFormField, errors }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 
        className="text-lg font-semibold"
        style={{ color: "var(--card-foreground)" }}
      >
        Additional Information
      </h3>

      <FormField
        label="Slogan"
        placeholder="Your inspiring tagline"
        value={formData.slogan || ""}
        onChange={updateFormField("slogan")}
        error={errors.slogan}
      />

      <FormField
        label="Social Media & Website Links"
        placeholder="https://website.com, https://facebook.com/page, https://twitter.com/handle"
        value={arrayFieldToString(formData.links)}
        onChange={(value) => updateFormField("links")(value)}
        error={errors.links}
        multiline
        rows={2}
      />

      <FormField
        label="Core Products/Services"
        placeholder="Product A, Service B, Solution C"
        value={arrayFieldToString(formData.coreProducts)}
        onChange={(value) => updateFormField("coreProducts")(value)}
        error={errors.coreProducts}
        multiline
        rows={2}
      />
    </div>
  );
}

function BusinessDetailsSection({
  formData,
  updateFormField,
  errors,
}: SectionProps) {
  return (
    <div className="space-y-6">
      <h3 
        className="text-lg font-semibold"
        style={{ color: "var(--card-foreground)" }}
      >
        Business Strategy & Goals
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Ideal Customers"
          placeholder="Describe your target audience and ideal customers"
          value={formData.idealCustomers || ""}
          onChange={updateFormField("idealCustomers")}
          error={errors.idealCustomers}
          multiline
          rows={3}
        />

        <FormField
          label="Brand Emotion"
          placeholder="What feeling or emotion should your brand evoke?"
          value={formData.brandEmotion || ""}
          onChange={updateFormField("brandEmotion")}
          error={errors.brandEmotion}
        />

        <FormField
          label="Unique Value Proposition"
          placeholder="What makes your business unique and valuable?"
          value={formData.uniqueProposition || ""}
          onChange={updateFormField("uniqueProposition")}
          error={errors.uniqueProposition}
          multiline
          rows={3}
        />

        <FormField
          label="Why Choose Us"
          placeholder="Why should customers choose your business over competitors?"
          value={formData.whyChooseUs || ""}
          onChange={updateFormField("whyChooseUs")}
          error={errors.whyChooseUs}
          multiline
          rows={3}
        />
      </div>

      <h4 
        className="text-md font-semibold mt-6"
        style={{ color: "var(--card-foreground)" }}
      >
        Business Goals
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Main Goal"
          placeholder="Primary business objective"
          value={formData.mainGoal || ""}
          onChange={updateFormField("mainGoal")}
          error={errors.mainGoal}
          multiline
          rows={2}
        />

        <FormField
          label="Short Term Goal"
          placeholder="Goals for next 6-12 months"
          value={formData.shortTermGoal || ""}
          onChange={updateFormField("shortTermGoal")}
          error={errors.shortTermGoal}
          multiline
          rows={2}
        />

        <FormField
          label="Long Term Goal"
          placeholder="Goals for next 2-5 years"
          value={formData.longTermGoal || ""}
          onChange={updateFormField("longTermGoal")}
          error={errors.longTermGoal}
          multiline
          rows={2}
        />
      </div>
    </div>
  );
}

function CompetitionSection({
  formData,
  updateFormField,
  errors,
}: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 
        className="text-lg font-semibold"
        style={{ color: "var(--card-foreground)" }}
      >
        Competition Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Direct Competitors"
          placeholder="Company A, Company B, Company C"
          value={arrayFieldToString(formData.competitors)}
          onChange={(value) => updateFormField("competitors")(value)}
          error={errors.competitors}
          multiline
          rows={3}
        />

        <FormField
          label="Indirect Competitors"
          placeholder="Alternative solutions or substitutes"
          value={arrayFieldToString(formData.indirectCompetitors)}
          onChange={(value) => updateFormField("indirectCompetitors")(value)}
          error={errors.indirectCompetitors}
          multiline
          rows={3}
        />
      </div>
    </div>
  );
}

function BrandingSection({ formData, updateFormField, errors }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 
        className="text-lg font-semibold"
        style={{ color: "var(--card-foreground)" }}
      >
        Branding & Assets
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Fonts Used"
          placeholder="Arial, Roboto, Open Sans"
          value={arrayFieldToString(formData.fontUsed)}
          onChange={(value) => updateFormField("fontUsed")(value)}
          error={errors.fontUsed}
        />

        <FormField
          label="SMM Drive Link"
          placeholder="https://drive.google.com/..."
          value={formData.smmDriveLink || ""}
          onChange={updateFormField("smmDriveLink")}
          error={errors.smmDriveLink}
        />
      </div>

      <FormField
        label="Contract Deliverables"
        placeholder="Monthly posts, weekly reports, etc."
        value={formData.contractDeliverables || ""}
        onChange={updateFormField("contractDeliverables")}
        error={errors.contractDeliverables}
        multiline
        rows={3}
      />
    </div>
  );
}