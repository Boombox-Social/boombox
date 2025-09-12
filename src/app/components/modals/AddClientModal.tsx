// File Structure: src/app/components/modals/AddClientModal.tsx - Multi-step modal with improved type safety
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

  // Check if current user can assign SMMs (only ADMIN and SUPER_ADMIN)
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

  // Helper function to safely convert form fields to arrays
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

    // If not on the last step, just go to next step
    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    // Final step - validate and submit
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Transform form data for API - ensure all array fields are arrays
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
        // UPDATED: Include assignedUserIds
        assignedUserIds: assignedUserIds,
      };

      // Call the onSubmit callback which will use useClientManagement's addClient
      await onSubmit(clientData);

      // Reset form and close modal
      setFormData(INITIAL_FORM_STATE);
      setLogoPreview("");
      setCurrentStep(0);
      setAssignedUserIds([]); // Reset assigned users
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
    // Clear error when user starts typing
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
    setAssignedUserIds([]); // Reset assigned users
    setErrors({});
    onClose();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
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
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2D3142]">
          <div>
            <h2 className="text-2xl font-bold text-[#F1F5F9] mb-1">
              Add New Client
            </h2>
            <p className="text-[#94A3B8] text-sm">
              Create a new client profile for your portfolio
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#2D3142] rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-[#94A3B8]" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    index <= currentStep
                      ? "bg-[#2563eb] text-white"
                      : "bg-[#2D3142] text-[#94A3B8]"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      index <= currentStep ? "text-[#F1F5F9]" : "text-[#94A3B8]"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-[#94A3B8]">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    index < currentStep ? "bg-[#2563eb]" : "bg-[#2D3142]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Display */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{errors.submit}</p>
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

              {/* NEW: SMM Assignment Section - Only for ADMIN/SUPER_ADMIN */}
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
          <div className="flex items-center justify-between pt-6 border-t border-[#2D3142]">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? "bg-[#2D3142] text-[#94A3B8] cursor-not-allowed"
                  : "bg-[#2D3142] text-[#F1F5F9] hover:bg-[#374151]"
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-[#2D3142] text-[#F1F5F9] rounded-lg font-medium hover:bg-[#374151] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#2563eb] text-white rounded-lg font-medium hover:bg-[#1E40AF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

// NEW: SMM Assignment Section Component
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
      <h3 className="text-lg font-semibold text-[#F1F5F9]">SMM Assignment</h3>
      <p className="text-sm text-[#94A3B8]">
        Select which Social Media Managers should be assigned to this client.
        Leave empty to assign later.
      </p>

      <div className="bg-[#23262F] rounded-lg p-4 border border-[#2D3142]">
        <UserAssignmentSelector
          initialAssignedUserIds={assignedUserIds}
          onChange={setAssignedUserIds}
          canEdit={true}
        />
      </div>
    </div>
  );
}

// Section Components with improved styling
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
          <div className="w-20 h-20 rounded-full bg-[#2D3142] border-2 border-dashed border-[#94A3B8] flex items-center justify-center overflow-hidden hover:border-[#2563eb] transition-colors">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-10 h-10 text-[#94A3B8]" />
            )}
          </div>
          {logoPreview && (
            <button
              type="button"
              onClick={() => setLogoPreview("")}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
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
          className="px-4 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-[#1E40AF] cursor-pointer transition-colors"
        >
          Upload Logo
        </label>
        {errors.logo && (
          <p className="text-red-400 text-xs text-center">{errors.logo}</p>
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

// Basic Info Section (Step 0 - additional fields)
function BasicInfoSection({ formData, updateFormField, errors }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F1F5F9]">
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

// Business Details Section (Step 1)
function BusinessDetailsSection({
  formData,
  updateFormField,
  errors,
}: SectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#F1F5F9]">
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

      <h4 className="text-md font-semibold text-[#F1F5F9] mt-6">
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

// Competition Section (Step 2)
function CompetitionSection({
  formData,
  updateFormField,
  errors,
}: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F1F5F9]">
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

// Branding Section (Step 2)
function BrandingSection({ formData, updateFormField, errors }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F1F5F9]">
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
