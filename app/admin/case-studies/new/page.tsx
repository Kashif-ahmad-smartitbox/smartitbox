"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Save,
  Image as ImageIcon,
  Plus,
  X,
  Loader2,
  Calendar,
  Tag,
  FileText,
  Edit3,
  Star,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createStory,
  StoryCreatePayload,
} from "@/app/services/modules/stories";
import { useAlert } from "@/app/components/alerts/AlertProvider";
import RichTextEditor from "@/components/common/RichTextEditor";

// Constants
const AUTOSAVE_KEY = "smartitbox:create-story:autosave:v1";
const WORDS_PER_MINUTE = 200;
const META_DESC_MAX_LENGTH = 320;
const AUTOSAVE_INTERVAL = 12000;

// Types
interface StoryFormData {
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  tags: string[];
  image: string;
  publishDate: string;
  status: "draft" | "published";
  featured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface ValidationErrors {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  metaDescription?: string;
}

// Utility functions
const estimateReadingTime = (html: string): number => {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getInitialFormData = (): StoryFormData => {
  if (typeof window === "undefined") {
    return getDefaultFormData();
  }

  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (raw) {
      const savedData = JSON.parse(raw) as StoryFormData;
      return { ...getDefaultFormData(), ...savedData };
    }
  } catch {
    // Ignore parsing errors and return default data
  }

  return getDefaultFormData();
};

const getDefaultFormData = (): StoryFormData => ({
  title: "",
  subtitle: "",
  excerpt: "",
  body: "",
  tags: [],
  image: "",
  publishDate: new Date().toISOString().split("T")[0],
  status: "draft",
  featured: false,
  order: 0,
  metaTitle: "",
  metaDescription: "",
});

export default function CreateStory() {
  const router = useRouter();
  const { push } = useAlert();

  // State
  const [formData, setFormData] = useState<StoryFormData>(getInitialFormData);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isDirty, setIsDirty] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // Refs
  const unloadRef = useRef<((e: BeforeUnloadEvent) => void) | null>(null);
  const saveTimer = useRef<number | null>(null);

  // Derived state
  const readingTime = estimateReadingTime(formData.body);
  const wordCount = formData.body
    .replace(/<[^>]*>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const isFormValid = Boolean(formData.title.trim() && formData.body.trim());

  // Effects
  useEffect(() => {
    setIsDirty(true);
  }, [formData]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent): void => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    unloadRef.current = handler;
    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [isDirty]);

  useEffect(() => {
    if (saveTimer.current) {
      clearInterval(saveTimer.current);
    }

    saveTimer.current = window.setInterval(() => {
      if (!isDirty) return;
      try {
        setSavingDraft(true);
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
        setSavingDraft(false);
      } catch {
        setSavingDraft(false);
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (saveTimer.current) {
        clearInterval(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, [isDirty, formData]);

  useEffect(() => {
    if (!formData.image) {
      setImageError(false);
      return;
    }

    let mounted = true;
    const img = new Image();

    img.onload = () => mounted && setImageError(false);
    img.onerror = () => mounted && setImageError(true);

    try {
      img.src = formData.image;
    } catch {
      mounted && setImageError(true);
    }

    return () => {
      mounted = false;
    };
  }, [formData.image]);

  // Handlers
  const clearAutosave = useCallback(() => {
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
    } catch {
      // Ignore errors
    }
    setIsDirty(false);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof StoryFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (validationErrors[field as keyof ValidationErrors]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [validationErrors]
  );

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase();
    if (formData.tags.some((tag) => tag.toLowerCase() === normalized)) {
      setTagInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, trimmed],
    }));
    setTagInput("");
  }, [tagInput, formData.tags]);

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
    if (e.key === "Escape") {
      setTagInput("");
    }
  };

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.subtitle.trim()) {
      errors.subtitle = "Subtitle is required";
    }

    if (!formData.body.trim()) {
      errors.content = "Content is required";
    }

    if (formData.image && !isValidUrl(formData.image)) {
      errors.image = "Please enter a valid URL";
    }

    if ((formData.metaDescription || "").length > META_DESC_MAX_LENGTH) {
      errors.metaDescription = `Meta description should be under ${META_DESC_MAX_LENGTH} characters`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const buildPayload = useCallback(
    (data: StoryFormData): StoryCreatePayload => {
      const metaTitle = data.metaTitle?.trim() || data.title.trim() || "Story";
      const metaDescription =
        data.metaDescription?.trim() ||
        data.excerpt?.trim() ||
        data.body.replace(/<[^>]*>/g, "").slice(0, 160);

      return {
        title: data.title.trim(),
        subtitle: data.subtitle.trim(),
        body: data.body,
        tags: data.tags.length ? data.tags : [],
        image: data.image,
        status: data.status === "published" ? "published" : "draft",
        featured: data.featured,
        metaTitle,
        metaDescription,
      };
    },
    []
  );

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = buildPayload(formData);
      const res = await createStory(payload);

      push({
        title: "Success",
        message: "Story saved successfully.",
        variant: "success",
      });

      clearAutosave();

      // Navigate to stories list
      router.push("/admin/dashboard/content/case-studies");
    } catch (err: any) {
      console.error("Create story failed:", err);
      push({
        title: "Error",
        message:
          err?.message ||
          err?.response?.data?.message ||
          "Failed to create story.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveDraftLocally = () => {
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
      setIsDirty(true);
      push({
        title: "Draft saved",
        message: "Draft saved locally.",
        variant: "success",
      });
    } catch {
      push({
        title: "Error",
        message: "Failed to save draft locally.",
        variant: "error",
      });
    }
  };

  // Render helpers
  const renderStatusBadge = () => (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${
          formData.status === "published"
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-amber-100 text-amber-700 border border-amber-200"
        }`}
      >
        {formData.status === "published" ? "Published" : "Draft"}
      </span>
      {formData.featured && (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
          <Star className="w-3 h-3" />
          Featured
        </span>
      )}
    </div>
  );

  const renderImagePreview = () => {
    if (!formData.image || imageError) {
      return (
        <div className="mt-3 rounded-lg border border-dashed border-gray-300 p-6 text-center bg-gray-50">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm font-medium">No story image</p>
          <p className="text-xs text-gray-500 mt-1">
            Add a URL to display preview
          </p>
        </div>
      );
    }

    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={formData.image}
          alt="Story preview"
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Eye className="w-6 h-6 text-primary-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Story
                </h1>
              </div>
              <p className="text-gray-600 text-base pl-11">
                Share compelling stories and experiences with your audience
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium mb-1">Status</p>
                {renderStatusBadge()}
                <div className="mt-2 text-xs text-gray-500">
                  Reading ~{readingTime} min • {wordCount} words
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          aria-label="Create story form"
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content - Modified Layout */}
            <div className="xl:col-span-3 space-y-6">
              {/* Story Header Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  Story Header
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label
                      className="text-base font-semibold text-gray-900 mb-3 block"
                      htmlFor="title"
                    >
                      Story Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter a captivating story title..."
                      className={`w-full px-4 py-3 border text-base rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        validationErrors.title
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      aria-required
                    />
                    {validationErrors.title && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {validationErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label
                      className="text-base font-semibold text-gray-900 mb-3 block"
                      htmlFor="subtitle"
                    >
                      Subtitle *
                    </label>
                    <input
                      id="subtitle"
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) =>
                        handleInputChange("subtitle", e.target.value)
                      }
                      placeholder="A compelling subtitle that hooks readers..."
                      className={`w-full px-4 py-3 border text-base rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${
                        validationErrors.subtitle
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      aria-required
                    />
                    {validationErrors.subtitle && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {validationErrors.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Excerpt */}
                <div className="mt-6">
                  <label
                    className="text-base font-semibold text-gray-900 mb-3 block"
                    htmlFor="excerpt"
                  >
                    Story Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      handleInputChange("excerpt", e.target.value)
                    }
                    placeholder="Write a compelling excerpt that makes readers want to dive into your story..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 text-base rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none transition-all"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.excerpt.length}/160 characters
                  </p>
                </div>
              </div>

              {/* Content and Sidebar Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Story Content */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <label
                      className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2"
                      htmlFor="content"
                    >
                      <Edit3 className="w-5 h-5 text-primary-600" />
                      Story Content *
                    </label>

                    <RichTextEditor
                      value={formData.body}
                      onChange={(value) => handleInputChange("body", value)}
                      placeholder="Start writing your compelling story here... Share your experiences, insights, and narrative."
                      minHeight="500px"
                    />

                    {validationErrors.content && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {validationErrors.content}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <div>{formData.body.length} characters</div>
                      <div>{wordCount} words</div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Story Image */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-primary-600" />
                      Story Image
                    </h3>

                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        handleInputChange("image", e.target.value);
                        setImageError(false);
                      }}
                      placeholder="https://example.com/story-image.jpg"
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm ${
                        validationErrors.image
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                    />
                    {validationErrors.image && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <X className="w-4 h-4" />
                        {validationErrors.image}
                      </p>
                    )}

                    {renderImagePreview()}
                  </div>

                  {/* Story Settings */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <Save className="w-5 h-5 text-primary-600" />
                      Story Settings
                    </h3>

                    <div className="space-y-4">
                      {/* Featured Toggle */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Featured Story
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange("featured", !formData.featured)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formData.featured ? "bg-yellow-500" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.featured
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Publication Status
                        </label>
                        <div className="relative">
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              handleInputChange(
                                "status",
                                e.target.value as "draft" | "published"
                              )
                            }
                            className="appearance-none w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-800 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                          >
                            <option value="draft">Save as Draft</option>
                            <option value="published">Publish Now</option>
                          </select>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Publish Date */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Publish Date
                        </label>
                        <input
                          type="date"
                          value={formData.publishDate}
                          onChange={(e) =>
                            handleInputChange("publishDate", e.target.value)
                          }
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={isSaving || !isFormValid}
                          className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>
                                {formData.status === "published"
                                  ? "Publish Story"
                                  : "Save Draft"}
                              </span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={saveDraftLocally}
                          className="px-4 py-3 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50"
                        >
                          Save Locally
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <Tag className="w-5 h-5 text-primary-600" />
                      Tags
                    </h3>

                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Add a tag..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className="px-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1.5 hover:text-primary-900 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      {formData.tags.length === 0 && (
                        <p className="text-gray-500 text-sm italic">
                          No tags added yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-600" />
                      SEO
                    </h3>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Meta Title</label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) =>
                          handleInputChange("metaTitle", e.target.value)
                        }
                        placeholder="Optional meta title for SEO"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      />

                      <label className="text-sm font-medium">
                        Meta Description
                      </label>
                      <textarea
                        value={formData.metaDescription}
                        onChange={(e) =>
                          handleInputChange("metaDescription", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="text-xs text-gray-500">
                        {(formData.metaDescription || "").length}/
                        {META_DESC_MAX_LENGTH} characters
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
