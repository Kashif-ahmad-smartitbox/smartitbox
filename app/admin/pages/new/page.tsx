"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/services/modules/pageModule";
import {
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Settings,
  Calendar,
  Link,
  FileText,
  Globe,
  Type,
  Hash,
  Info,
  ChevronDown,
  Eye,
} from "lucide-react";

// ────────────────────────────────
// Types
// ────────────────────────────────

type PageStatus = "draft" | "published" | "scheduled";
type PageType = "default" | "solutions" | "services" | "policies";

interface PageFields {
  title: string;
  slug: string;
  type: PageType;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  status: PageStatus;
  publishedAt?: string;
}

interface UpdateMessage {
  type: "success" | "error";
  text: string;
}

// ────────────────────────────────
// Constants
// ────────────────────────────────

const PAGE_TYPES = [
  { value: "default" as const, label: "Default" },
  { value: "solutions" as const, label: "Solutions" },
  { value: "services" as const, label: "Services" },
  { value: "policies" as const, label: "Policies" },
];

const PAGE_STATUSES = [
  { value: "draft" as const, label: "Draft" },
  { value: "published" as const, label: "Published" },
  { value: "scheduled" as const, label: "Scheduled" },
];

// ────────────────────────────────
// Utility Functions
// ────────────────────────────────

const formatDateForInput = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug);
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getPreviewPath = (type: PageType, slug: string) => {
  const trimmedSlug = slug.trim();
  if (trimmedSlug === "home") return "/";

  const prefix = type && type !== "default" ? `/${type}` : "";
  return trimmedSlug ? `${prefix}/${trimmedSlug}` : `${prefix}/`;
};

// ────────────────────────────────
// Input Components
// ────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: "text" | "textarea" | "datetime-local";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  icon,
  fullWidth = false,
  helperText,
  error,
  disabled = false,
  readOnly = false,
}) => {
  const baseClasses = `
    w-full border rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary-500 
    transition-all duration-200 bg-white placeholder-gray-400
    ${
      error
        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300"
    }
    ${disabled || readOnly ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}
    ${icon ? "pl-11" : "pl-4"}
    ${readOnly ? "select-all bg-blue-50 border-blue-200" : ""}
  `;

  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {readOnly && (
          <span className="ml-2 text-xs text-blue-600 font-normal">
            (auto-generated)
          </span>
        )}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            placeholder={placeholder}
            rows={4}
            className={`${baseClasses} resize-none`}
            disabled={disabled || readOnly}
            readOnly={readOnly}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            placeholder={placeholder}
            required={required}
            className={baseClasses}
            disabled={disabled || readOnly}
            readOnly={readOnly}
          />
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  disabled?: boolean;
  helperText?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
  disabled = false,
  helperText,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary-500 
            focus:border-primary-500 transition-all duration-200 bg-white appearance-none
            ${disabled ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}
            ${icon ? "pl-11" : "pl-4"}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {helperText && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

// ────────────────────────────────
// Preview URL Component
// ────────────────────────────────

interface PreviewUrlProps {
  type: PageType;
  slug: string;
  title: string;
}

const PreviewUrl: React.FC<PreviewUrlProps> = ({ type, slug, title }) => {
  const previewPath = useMemo(() => {
    const effectiveSlug = slug || generateSlug(title);
    return getPreviewPath(type, effectiveSlug);
  }, [type, slug, title]);

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
        <Eye className="w-4 h-4" />
        Preview URL
      </p>
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 border border-blue-200">
        <span className="text-sm font-mono text-blue-700 break-all">
          {previewPath}
        </span>
      </div>
    </div>
  );
};

// ────────────────────────────────
// Main Component
// ────────────────────────────────

export default function CreatePage() {
  const router = useRouter();

  // ────────────────────────────────
  // State Management
  // ────────────────────────────────
  const [pageFields, setPageFields] = useState<PageFields>({
    title: "",
    slug: "",
    type: "default",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    status: "draft",
    publishedAt: "",
  });

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PageFields, string>>
  >({});
  const [creatingPage, setCreatingPage] = useState(false);
  const [message, setMessage] = useState<UpdateMessage | null>(null);

  // ────────────────────────────────
  // Memoized Values
  // ────────────────────────────────
  const generatedSlug = useMemo(
    () => generateSlug(pageFields.title),
    [pageFields.title]
  );

  // ────────────────────────────────
  // Event Handlers
  // ────────────────────────────────
  const handleTitleChange = useCallback((value: string) => {
    setPageFields((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value), // Auto-generate slug from title
    }));
  }, []);

  const updateField = useCallback(
    (field: keyof PageFields, value: string) => {
      setPageFields((prev) => ({ ...prev, [field]: value }));
      // Clear field error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [fieldErrors]
  );

  // ────────────────────────────────
  // Validation
  // ────────────────────────────────
  const validateFields = useCallback((): boolean => {
    const errors: Partial<Record<keyof PageFields, string>> = {};

    if (!pageFields.title.trim()) {
      errors.title = "Title is required";
    }

    if (!pageFields.slug.trim()) {
      errors.slug = "Slug is required";
    } else if (!isValidSlug(pageFields.slug)) {
      errors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (pageFields.canonicalUrl && !isValidUrl(pageFields.canonicalUrl)) {
      errors.canonicalUrl = "Please enter a valid URL";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pageFields]);

  // ────────────────────────────────
  // Page Creation
  // ────────────────────────────────
  const handlePageCreate = async () => {
    if (!validateFields()) {
      setMessage({ type: "error", text: "Please fix the errors above" });
      return;
    }

    setCreatingPage(true);
    setMessage(null);

    try {
      let canonicalUrl = pageFields.canonicalUrl?.trim() || undefined;
      if (canonicalUrl && !/^https?:\/\//i.test(canonicalUrl)) {
        canonicalUrl = `https://${canonicalUrl}`;
      }

      const payload = {
        title: pageFields.title.trim(),
        slug: pageFields.slug.trim(),
        type: pageFields.type,
        excerpt: pageFields.excerpt?.trim() || undefined,
        metaTitle: pageFields.metaTitle?.trim() || undefined,
        metaDescription: pageFields.metaDescription?.trim() || undefined,
        canonicalUrl,
        status: pageFields.status as "draft" | "published",
        publishedAt: pageFields.publishedAt
          ? new Date(pageFields.publishedAt).toISOString()
          : undefined,
        layout: [],
      };

      const response = await createPage(payload);

      setMessage({
        type: "success",
        text: "Page created successfully! Redirecting...",
      });

      setTimeout(() => {
        router.push(`/admin/pages/${response.page._id}/edit`);
      }, 1500);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to create page",
      });
    } finally {
      setCreatingPage(false);
    }
  };

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-3 hover:bg-white rounded-xl transition-all duration-200 border border-gray-200 bg-white/50 backdrop-blur-sm hover:shadow-sm"
                type="button"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Create New Page
                </h1>
                <p className="text-gray-500 mt-2">
                  Create a new page with basic settings. You can add modules
                  after creation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* SIDEBAR */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Page Information
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Layout</p>
                  <p className="text-sm font-medium text-gray-900">
                    Empty (add modules after creation)
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Modules</p>
                  <p className="text-sm font-medium text-gray-900">
                    Can be added after publishing
                  </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Page modules will be available after
                    the page is created.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Page Settings
                    </h2>
                    <p className="text-gray-500">
                      Configure your page details, SEO settings, and publication
                      status
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-8">
                {/* Basic Information */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Type className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Title"
                      value={pageFields.title}
                      onChange={handleTitleChange}
                      placeholder="Enter page title"
                      required
                      icon={<Type className="w-4 h-4" />}
                      error={fieldErrors.title}
                      helperText="This will automatically generate the slug"
                    />

                    <div>
                      <InputField
                        label="Slug"
                        value={pageFields.slug}
                        onChange={(value) => updateField("slug", value)}
                        placeholder="auto-generated-slug"
                        required
                        icon={<Hash className="w-4 h-4" />}
                        error={fieldErrors.slug}
                        helperText="Auto-generated from title. Edit with caution."
                        readOnly={true}
                      />
                      <PreviewUrl
                        type={pageFields.type}
                        slug={pageFields.slug}
                        title={pageFields.title}
                      />
                    </div>

                    <SelectField
                      label="Page Type"
                      value={pageFields.type}
                      onChange={(value) => updateField("type", value)}
                      options={PAGE_TYPES}
                      icon={<FileText className="w-4 h-4" />}
                      helperText="Select the type of page"
                    />

                    <InputField
                      label="Excerpt"
                      value={pageFields.excerpt || ""}
                      onChange={(value) => updateField("excerpt", value)}
                      placeholder="Brief description of your page"
                      type="textarea"
                      fullWidth
                    />
                  </div>
                </section>

                {/* SEO Settings */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      SEO Settings
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Meta Title"
                      value={pageFields.metaTitle || ""}
                      onChange={(value) => updateField("metaTitle", value)}
                      placeholder="SEO title for search engines"
                      icon={<Type className="w-4 h-4" />}
                      helperText="Recommended: 50-60 characters"
                    />

                    <InputField
                      label="Meta Description"
                      value={pageFields.metaDescription || ""}
                      onChange={(value) =>
                        updateField("metaDescription", value)
                      }
                      placeholder="SEO description for search engines"
                      type="textarea"
                      fullWidth
                      helperText="Recommended: 150-160 characters"
                    />

                    <InputField
                      label="Canonical URL"
                      value={pageFields.canonicalUrl || ""}
                      onChange={(value) => updateField("canonicalUrl", value)}
                      placeholder="https://yourwebsite.com/page"
                      fullWidth
                      icon={<Link className="w-4 h-4" />}
                      error={fieldErrors.canonicalUrl}
                      helperText="The preferred version of this page for SEO"
                    />
                  </div>
                </section>

                {/* Publication Settings */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Publication Settings
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="Status"
                      value={pageFields.status}
                      onChange={(value) => updateField("status", value)}
                      options={PAGE_STATUSES}
                      icon={<Calendar className="w-4 h-4" />}
                      helperText="Choose whether to publish now or save as draft"
                    />

                    <InputField
                      label="Published At"
                      value={pageFields.publishedAt || ""}
                      onChange={(value) => updateField("publishedAt", value)}
                      type="datetime-local"
                      icon={<Calendar className="w-4 h-4" />}
                      helperText="Schedule publication for a future date"
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">
                          Modules Availability
                        </h4>
                        <p className="text-blue-800 text-sm leading-relaxed">
                          After creating the page, you can add and manage
                          modules in the edit view. Modules are fully editable
                          once the page is created.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    {message && (
                      <div
                        className={`flex items-center gap-3 p-4 rounded-xl border ${
                          message.type === "success"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}
                      >
                        {message.type === "success" ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span className="font-medium">{message.text}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold hover:shadow-sm"
                      type="button"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handlePageCreate}
                      disabled={creatingPage}
                      className={`flex items-center gap-3 px-8 py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-200 min-w-[160px] justify-center ${
                        creatingPage
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/25"
                      }`}
                      type="button"
                    >
                      {creatingPage ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Create Page
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
