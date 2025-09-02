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
  const { authState: _authState } = useAuth(); // Prefix with _ to indicate intentionally unused
  const [formData, setFormData] = useState<NewClientForm>(INITIAL_FORM_STATE);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(0);

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

    if (currentStep < steps.length - 1) {
      if (validateStep(currentStep)) {
        setCurrentStep((prev) => prev + 1);
      }
      return;
    }

    // Final submission
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setErrors({});

    try {
      const processedData: NewClientForm = {
        ...formData,
        links: safeStringToArray(formData.links),
        coreProducts: safeStringToArray(formData.coreProducts),
        competitors: safeStringToArray(formData.competitors),
        indirectCompetitors: safeStringToArray(formData.indirectCompetitors),
        brandAssets: safeStringToArray(formData.brandAssets),
        fontUsed: safeStringToArray(formData.fontUsed),
        logo: logoPreview || null,
      };

      if (process.env.NODE_ENV !== "production") {
        console.log("Form submission:", processedData);
      }

      await onSubmit(processedData);

      // Reset form on success
      setFormData(INITIAL_FORM_STATE);
      setLogoPreview("");
      setCurrentStep(0);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Form submission error:", error);
      }

      setErrors({
        submit:
          error instanceof Error ? error.message : "Failed to create client",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    setLogoPreview("");
    setCurrentStep(0);
    setErrors({});
    onClose();
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, logo: "Please select an image file" }));
      return;
    }

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
  };

  const _nextStep = () => {
    // Prefix with _ since it's not used but might be needed later
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F1F5F9]">
        Company Information
      </h3>

      {/* Logo Upload */}
      <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-[#2D3142] rounded-lg">
        <div className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-[#94A3B8]" />
          <div className="mt-4">
            <label
              htmlFor="logo-upload"
              className="cursor-pointer rounded-md bg-[#2563eb] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1E40AF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
            >
              Upload Company Logo
            </label>
            <input
              id="logo-upload"
              name="logo-upload"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={onLogoUpload}
            />
          </div>
          <p className="text-xs leading-5 text-[#94A3B8] mt-2">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>

        {/* Logo Preview */}
        {logoPreview && (
          <div className="mt-4">
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="h-16 w-16 rounded-full object-cover"
            />
            <button
              type="button"
              onClick={() => setLogoPreview("")}
              className="mt-2 text-sm text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        )}

        {errors.logo && <p className="text-sm text-red-400">{errors.logo}</p>}
      </div>

      {/* Basic Company Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField
            label="Company Name *"
            placeholder="Enter company name"
            value={formData.name}
            onChange={updateFormField("name")}
            error={errors.name}
          />
        </div>
        <FormField
          label="Industry *"
          placeholder="e.g., Technology, Healthcare, Finance"
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
  );
}

// You'll need to implement the other section components similarly...
function BasicInfoSection({ formData, updateFormField, errors }: SectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        label="Company Slogan"
        placeholder="Your company's tagline or slogan"
        value={formData.slogan || ""}
        onChange={updateFormField("slogan")}
        error={errors.slogan}
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F1F5F9]">Business Details</h3>

      <FormField
        label="Core Products/Services"
        placeholder="List your main products or services"
        value={arrayFieldToString(formData.coreProducts)}
        onChange={updateFormField("coreProducts")}
        error={errors.coreProducts}
        multiline
        rows={3}
      />
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
      <h3 className="text-lg font-semibold text-[#F1F5F9]">
        Competition Analysis
      </h3>

      <FormField
        label="Direct Competitors"
        placeholder="List your main competitors"
        value={arrayFieldToString(formData.competitors)}
        onChange={updateFormField("competitors")}
        error={errors.competitors}
        multiline
        rows={3}
      />
    </div>
  );
}

function BrandingSection({ formData, updateFormField, errors }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F1F5F9]">Brand Assets</h3>

      <FormField
        label="Brand Assets URLs"
        placeholder="Links to brand assets, logos, etc."
        value={arrayFieldToString(formData.brandAssets)}
        onChange={updateFormField("brandAssets")}
        error={errors.brandAssets}
        multiline
        rows={3}
      />
    </div>
  );
}
