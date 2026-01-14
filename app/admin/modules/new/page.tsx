"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Code2, CheckCircle, AlertCircle } from "lucide-react";
import { createModule } from "@/services/modules/module";

type Status = "draft" | "published";

const HERO_EXAMPLE = {
  title: "Welcome",
  subtitle: "Our tagline",
  image: "/uploads/media/123.jpg",
  cta: { text: "Try", href: "/signup" },
};

export default function CreateModules() {
  const router = useRouter();

  const [type, setType] = useState<string>("hero");
  const [title, setTitle] = useState<string>("Homepage Hero");
  const [status, setStatus] = useState<Status>("published");
  const [contentText, setContentText] = useState<string>(
    JSON.stringify(HERO_EXAMPLE, null, 2)
  );

  const [contentError, setContentError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // helper: try parse JSON and return parsed value or error
  const parseJson = useCallback((text: string) => {
    try {
      return { ok: true, value: JSON.parse(text) };
    } catch (err: any) {
      return { ok: false, error: err?.message ?? "Invalid JSON" };
    }
  }, []);

  const formatContent = useCallback(() => {
    const parsed = parseJson(contentText);
    if (!parsed.ok) {
      setContentError(parsed.error);
      return;
    }
    setContentText(JSON.stringify(parsed.value, null, 2));
    setContentError(null);
  }, [contentText, parseJson]);

  const loadExample = useCallback(() => {
    setType("hero");
    setTitle("Homepage Hero");
    setStatus("published");
    setContentText(JSON.stringify(HERO_EXAMPLE, null, 2));
    setContentError(null);
    setServerError(null);
    setSuccessMessage(null);
  }, []);

  const clearForm = useCallback(() => {
    setType("");
    setTitle("");
    setStatus("draft");
    setContentText("{\n  \n}");
    setContentError(null);
    setServerError(null);
    setSuccessMessage(null);
  }, []);

  const buildPayload = useCallback(() => {
    const parsed = parseJson(contentText);
    if (!parsed.ok) {
      setContentError(parsed.error);
      return null;
    }
    setContentError(null);
    return {
      type: type.trim(),
      title: title.trim() || undefined,
      content: parsed.value,
      status,
    };
  }, [contentText, parseJson, type, title, status]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setServerError(null);
      setSuccessMessage(null);

      if (!type.trim()) {
        setServerError("Module type is required");
        return;
      }

      const payload = buildPayload();
      if (!payload) return;

      setSubmitting(true);
      try {
        await createModule(payload);
        setSuccessMessage("Module created successfully! Redirecting...");

        setTimeout(() => router.push("/admin/"), 1200);
      } catch (err: any) {
        // apiClient normalizes errors to Error.message
        setServerError(err?.message ?? "Network error occurred");
      } finally {
        setSubmitting(false);
      }
    },
    [type, buildPayload, router]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <img src="/logo.svg" alt="Smartitbox Logo" />
              <div className="space-x-3 my-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Module
                </h1>
              </div>
              <p className="text-gray-600">
                Build reusable content modules with custom JSON structure
              </p>
            </div>
            <button
              onClick={() => router.push("/admin")}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>

        {/* Example Button */}
        <div className="mb-6">
          <button
            onClick={loadExample}
            className="px-4 py-2 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            Load Hero Example
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Type *
                  </label>
                  <input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., hero, features"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Module title (optional)"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="draft"
                      checked={status === "draft"}
                      onChange={(e) => setStatus(e.target.value as Status)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Draft</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="published"
                      checked={status === "published"}
                      onChange={(e) => setStatus(e.target.value as Status)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">Published</span>
                  </label>
                </div>
              </div>

              {/* JSON Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Code2 className="w-4 h-4 mr-2" />
                    Content (JSON)
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={formatContent}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Format JSON
                    </button>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    rows={12}
                    className={`w-full font-mono text-sm rounded-lg border p-3 focus:outline-none focus:ring-2 ${
                      contentError
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-primary-500"
                    }`}
                    placeholder='{"key": "value"}'
                  />
                  {contentError && (
                    <div className="mt-2 flex items-center text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {contentError}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {serverError && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-500 mr-3 w-5 h-5" />
                  <div className="text-red-700 text-sm">{serverError}</div>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="text-green-500 mr-3 w-5 h-5" />
                  <div className="text-green-700 text-sm">{successMessage}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Form
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Module</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
