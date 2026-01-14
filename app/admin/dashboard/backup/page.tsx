"use client";

import React, { useState, useRef } from "react";
import {
  Database,
  Download,
  Upload,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  exportCollectionsDownload,
  importNdjson,
  exportBinaryDumpDownload,
  importBinaryDump,
} from "@/services/modules/backup";
import { getCookie } from "@/app/lib/cookies";
import { useAlert } from "@/components/alerts/AlertProvider";

const Backup: React.FC = () => {
  const [ndjsonImporting, setNdjsonImporting] = useState(false);
  const [binaryImporting, setBinaryImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingBinary, setExportingBinary] = useState(false);

  const ndjsonFileRef = useRef<HTMLInputElement>(null);
  const binaryFileRef = useRef<HTMLInputElement>(null);

  const { push } = useAlert();

  const getAccessToken = (): string | undefined => {
    return typeof window !== "undefined"
      ? getCookie("token") || undefined
      : undefined;
  };

  const handleExportCollections = async () => {
    try {
      setExporting(true);
      const token = getAccessToken();
      await exportCollectionsDownload(
        [
          "admins",
          "pages",
          "modules",
          "media",
          "stories",
          "blogs",
          "formsubmissions",
          "subscribers",
        ],
        token
      );
      push({
        title: "Export Successful",
        message: "Data exported successfully as NDJSON",
        variant: "success",
      });
    } catch (error: any) {
      push({
        title: "Export Failed",
        message: error?.message || "Failed to export data",
        variant: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleImportNdjson = async () => {
    const file = ndjsonFileRef.current?.files?.[0];
    if (!file) {
      push({
        title: "No File Selected",
        message: "Please select an NDJSON file to import",
        variant: "error",
      });
      return;
    }

    try {
      setNdjsonImporting(true);
      const token = getAccessToken();
      const result = await importNdjson(file, "upsert", token);

      if (result.success) {
        push({
          title: "Import Successful",
          message: "NDJSON data imported successfully",
          variant: "success",
        });
      } else {
        push({
          title: "Import Failed",
          message: result.message || "Failed to import data",
          variant: "error",
        });
      }
    } catch (error: any) {
      push({
        title: "Import Failed",
        message: error?.message || "Failed to import data",
        variant: "error",
      });
    } finally {
      setNdjsonImporting(false);
      if (ndjsonFileRef.current) ndjsonFileRef.current.value = "";
    }
  };

  const handleExportBinary = async () => {
    try {
      setExportingBinary(true);
      const token = getAccessToken();
      await exportBinaryDumpDownload(token);
      push({
        title: "Backup Successful",
        message: "Binary backup downloaded successfully",
        variant: "success",
      });
    } catch (error: any) {
      push({
        title: "Backup Failed",
        message: error?.message || "Failed to create backup",
        variant: "error",
      });
    } finally {
      setExportingBinary(false);
    }
  };

  const handleImportBinary = async () => {
    const file = binaryFileRef.current?.files?.[0];
    if (!file) {
      push({
        title: "No File Selected",
        message: "Please select a backup file to restore",
        variant: "error",
      });
      return;
    }

    if (
      !confirm(
        "WARNING: This will completely overwrite all existing data. This action cannot be undone. Continue?"
      )
    ) {
      return;
    }

    try {
      setBinaryImporting(true);
      const token = getAccessToken();
      const result = await importBinaryDump(file, token);

      if (result.success) {
        push({
          title: "Restore Successful",
          message: "Database restored successfully from backup",
          variant: "success",
        });
      } else {
        push({
          title: "Restore Failed",
          message: result.message || "Failed to restore backup",
          variant: "error",
        });
      }
    } catch (error: any) {
      push({
        title: "Restore Failed",
        message: error?.message || "Failed to restore backup",
        variant: "error",
      });
    } finally {
      setBinaryImporting(false);
      if (binaryFileRef.current) binaryFileRef.current.value = "";
    }
  };

  const Button: React.FC<{
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    icon: React.ReactNode;
    children: string;
    variant?: "primary" | "danger";
  }> = ({
    onClick,
    disabled,
    loading,
    icon,
    children,
    variant = "primary",
  }) => (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded border transition-colors ${
        variant === "danger"
          ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 disabled:opacity-50"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      }`}
    >
      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : icon}
      {loading ? "Processing..." : children}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Database className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
          <p className="text-gray-600">Export and import your site data</p>
        </div>
      </div>

      {/* Backup Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Export NDJSON */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Download className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Export Data (NDJSON)
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Download collections as portable NDJSON format
          </p>
          <Button
            onClick={handleExportCollections}
            disabled={exporting}
            loading={exporting}
            icon={<Download className="w-4 h-4" />}
          >
            Export NDJSON
          </Button>
        </div>

        {/* Import NDJSON */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Upload className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Import Data (NDJSON)
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Upload NDJSON backup to import data
          </p>
          <input
            ref={ndjsonFileRef}
            type="file"
            accept=".ndjson,.jsonl,.json"
            className="w-full text-sm mb-3 p-2 border border-gray-300 rounded"
          />
          <Button
            onClick={handleImportNdjson}
            disabled={ndjsonImporting}
            loading={ndjsonImporting}
            icon={<Upload className="w-4 h-4" />}
          >
            Import NDJSON
          </Button>
        </div>

        {/* Export Binary */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Download className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Export Data (Binary)
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Create a complete binary database dump
          </p>
          <Button
            onClick={handleExportBinary}
            disabled={exportingBinary}
            loading={exportingBinary}
            icon={<Download className="w-4 h-4" />}
          >
            Export Binary
          </Button>
        </div>

        {/* Import Binary */}
        <div className="border border-red-200 rounded-lg p-6 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-primary-900">
              Restore Data (Binary)
            </h3>
          </div>
          <p className="text-primary-700 text-sm mb-4">
            Upload binary backup to restore. This will overwrite all existing
            data.
          </p>
          <input
            ref={binaryFileRef}
            type="file"
            accept=".gz,.archive,.tar.gz"
            className="w-full text-sm mb-3 p-2 border border-primary-300 rounded"
          />
          <Button
            onClick={handleImportBinary}
            disabled={binaryImporting}
            loading={binaryImporting}
            icon={<AlertTriangle className="w-4 h-4" />}
            variant="danger"
          >
            Restore Backup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Backup;
