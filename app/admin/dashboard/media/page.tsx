"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Download,
  Image as ImageIcon,
  Search,
  X,
  Upload,
  File,
  Video,
  Music,
  Grid,
  List,
  Eye,
  Copy,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  listMedia as apiListMedia,
  uploadMultipleMedia as apiUploadMultipleMedia,
  deleteMedia as apiDeleteMedia,
} from "@/app/services/modules/media";
import { API_BASE_URL } from "@/app/services/api";
import { getCookie } from "@/app/lib/cookies";
import CommonDashHeader from "@/app/components/common/CommonDashHeader";
import { useModal } from "@/components/global/GlobalModalProvider";

// Types
interface MediaItem {
  id: string;
  name: string;
  src: string;
  sizeKb: number;
  uploadedAt: string;
  type: string;
  isLocal?: boolean;
}

interface UploadProgress {
  [key: string]: number;
}

// Constants
const ACCEPTED_FILE_TYPES = {
  "image/*": [],
  "video/*": [],
  "audio/*": [],
};

const FILE_TYPE_ICONS = {
  "image/": ImageIcon,
  "video/": Video,
  "audio/": Music,
  "application/pdf": File,
  default: File,
};

const FILE_TYPE_COLORS = {
  "image/": "from-primary-500 to-cyan-500",
  "video/": "from-purple-500 to-pink-500",
  "audio/": "from-green-500 to-emerald-500",
  "application/pdf": "from-red-500 to-orange-500",
  default: "from-gray-500 to-gray-700",
};

const formatSize = (kb: number): string => {
  if (kb < 1024) return `${Math.round(kb)} KB`;
  if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

const getFileIcon = (type: string) => {
  for (const [pattern, icon] of Object.entries(FILE_TYPE_ICONS)) {
    if (type.startsWith(pattern.replace("/*", ""))) {
      return icon;
    }
  }
  return FILE_TYPE_ICONS.default;
};

const getFileColor = (type: string) => {
  for (const [pattern, color] of Object.entries(FILE_TYPE_COLORS)) {
    if (type.startsWith(pattern.replace("/*", ""))) {
      return color;
    }
  }
  return FILE_TYPE_COLORS.default;
};

const publicBase = ((): string => {
  try {
    const base = API_BASE_URL || (process.env.NEXT_PUBLIC_API_BASE_URL ?? "");
    return base.replace(/\/api\/?$/, "");
  } catch {
    return "";
  }
})();

const mapServerItemToMediaItem = (serverItem: any): MediaItem => {
  const filename =
    serverItem.filename ?? serverItem.originalName ?? serverItem.name;
  const candidateUrl =
    serverItem.url ??
    serverItem.src ??
    (filename ? `${publicBase}/uploads/${filename}` : undefined) ??
    "";

  return {
    id: serverItem._id ?? serverItem.id ?? String(Math.random()),
    name:
      serverItem.filename ??
      serverItem.originalName ??
      serverItem.name ??
      "unknown",
    src: candidateUrl,
    sizeKb:
      typeof serverItem.size === "number"
        ? Math.max(1, serverItem.size / 1024)
        : serverItem.sizeKb ?? 0,
    uploadedAt:
      serverItem.createdAt ?? serverItem.uploadedAt ?? new Date().toISOString(),
    type: serverItem.mimeType ?? serverItem.type ?? "application/octet-stream",
  };
};

// Pagination state shape
type PaginationState = {
  page: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const MediaLibrary: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState("");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const modal = useModal();

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);

  const getAuthToken = useCallback((): string => {
    return getCookie("token") || "";
  }, []);

  const loadMedia = useCallback(
    async (p = page, l = limit) => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        const resp: any = await apiListMedia(p, l, token);
        const itemsArray: any[] = Array.isArray(resp)
          ? resp
          : Array.isArray(resp?.items)
          ? resp.items
          : [];

        const mapped = itemsArray.map(mapServerItemToMediaItem);
        setMedia(mapped);

        if (typeof resp?.total === "number") setTotal(resp.total);
        else setTotal(mapped.length);

        if (typeof resp?.page === "number") setPage(resp.page);
        else setPage(p);

        if (typeof resp?.limit === "number") setLimit(resp.limit);
        else setLimit(l);
      } catch (err) {
        console.error("Failed to load media:", err);
        setError("Failed to load media. Please try again.");
        setMedia([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken, page, limit]
  );

  useEffect(() => {
    void loadMedia(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void loadMedia(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setIsUploading(true);
      setError(null);

      const maxSize = 50 * 1024 * 1024;
      const oversizedFiles = Array.from(files).filter(
        (file) => file.size > maxSize
      );

      if (oversizedFiles.length > 0) {
        setError(
          `Some files exceed the 50MB size limit: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}`
        );
        setIsUploading(false);
        return;
      }

      const localPreviewItems: MediaItem[] = Array.from(files).map((file) => {
        const id = `local-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`;
        return {
          id,
          name: file.name,
          src: URL.createObjectURL(file),
          sizeKb: Math.max(1, file.size / 1024),
          uploadedAt: new Date().toISOString(),
          type: file.type || "application/octet-stream",
          isLocal: true,
        };
      });

      setMedia((prev) => [...localPreviewItems, ...prev]);

      try {
        const token = getAuthToken();
        const fileArray = Array.from(files);

        const progress: UploadProgress = {};
        fileArray.forEach((file) => {
          progress[file.name] = 10;
        });
        setUploadProgress(progress);

        const result = await apiUploadMultipleMedia(fileArray, token);

        const progressInterval = setInterval(() => {
          setUploadProgress((current) => {
            const updated = { ...current };
            Object.keys(updated).forEach((filename) => {
              if (updated[filename] < 90) {
                updated[filename] += 10;
              }
            });
            return updated;
          });
        }, 300);

        if (result.success && result.data) {
          clearInterval(progressInterval);

          setUploadProgress((current) => {
            const completed = { ...current };
            Object.keys(completed).forEach((filename) => {
              completed[filename] = 100;
            });
            return completed;
          });

          const uploadedItems: any[] = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.items)
            ? result.data.items
            : [result.data];

          const mappedReturned = uploadedItems.map(mapServerItemToMediaItem);

          setTimeout(async () => {
            setMedia((current) => current.filter((item) => !item.isLocal));
            setUploadProgress({});
            try {
              await loadMedia(1, limit);
            } catch (e) {
              console.warn(
                "refresh after upload failed, falling back to mapped items",
                e
              );
              setMedia((current) => [...mappedReturned, ...current]);
            }
          }, 500);
        } else {
          clearInterval(progressInterval);
          throw new Error(result.message || "Upload failed");
        }
      } catch (err: any) {
        console.error("Upload failed:", err);

        if (err.message?.includes('Failed to execute "set" on "Header"')) {
          setError(
            "Upload failed: Invalid authentication token. Please refresh the page and try again."
          );
        } else {
          setError(err.message || "Failed to upload files. Please try again.");
        }

        setTimeout(() => {
          setMedia((current) => current.filter((item) => !item.isLocal));
          setUploadProgress({});
        }, 1000);
      } finally {
        setIsUploading(false);
      }
    },
    [getAuthToken, loadMedia, limit]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (e.target) {
      e.target.value = "";
    }
  };

  // Delete uses modal.confirm
  const handleDelete = useCallback(
    async (item: MediaItem) => {
      if (item.isLocal) {
        if (item.src.startsWith("blob:")) {
          URL.revokeObjectURL(item.src);
        }
        setMedia((prev) =>
          prev.filter((mediaItem) => mediaItem.id !== item.id)
        );
        return;
      }

      try {
        const confirmOk = await modal.confirm({
          title: "Delete file",
          body: (
            <div className="text-sm text-gray-600">
              Are you sure you want to permanently delete{" "}
              <strong className="text-gray-900">{item.name}</strong>? This
              action cannot be undone.
            </div>
          ),
          confirmText: "Delete",
          cancelText: "Cancel",
          size: "sm",
        });

        if (!confirmOk) return;

        const token = getAuthToken();
        const result = await apiDeleteMedia(item.id, token);

        if (result.success) {
          const newTotal = Math.max(0, total - 1);
          const lastPage = Math.max(1, Math.ceil(newTotal / limit));
          if (page > lastPage) {
            setPage(lastPage);
          } else {
            void loadMedia(page, limit);
          }
        } else {
          throw new Error(result.message || "Delete failed");
        }
      } catch (err) {
        console.error("Delete error:", err);
        setError("Failed to delete file. Please try again.");
      }
    },
    [modal, getAuthToken, loadMedia, page, limit, total]
  );

  const handleDownload = (item: MediaItem) => {
    if (item.src.startsWith("blob:")) {
      fetch(item.src)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = item.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        })
        .catch((err) => {
          console.error("Download failed:", err);
          setError("Failed to download file");
        });
    } else {
      const a = document.createElement("a");
      a.href = item.src;
      a.download = item.name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard
      .writeText(item.src)
      .then(() => {
        // optional toast
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
      });
  };

  const filteredMedia = useMemo(() => {
    let filtered = media.filter(
      (item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.type.toLowerCase().includes(filter.toLowerCase())
    );

    if (fileTypeFilter !== "all") {
      filtered = filtered.filter((item) =>
        item.type.startsWith(fileTypeFilter)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = a.sizeKb - b.sizeKb;
          break;
        case "date":
          comparison =
            new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [media, filter, fileTypeFilter, sortBy, sortOrder]);

  const clearError = () => setError(null);

  const fileTypes = useMemo(() => {
    const types = new Set(
      media.map((item) => {
        if (item.type.startsWith("image/")) return "image/";
        if (item.type.startsWith("video/")) return "video/";
        if (item.type.startsWith("audio/")) return "audio/";
        return "other";
      })
    );
    return Array.from(types);
  }, [media]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const paginationState: PaginationState = useMemo(
    () => ({
      page,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }),
    [page, total, totalPages]
  );

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages && !loading) {
        setPage(newPage);
      }
    },
    [totalPages, loading]
  );

  // Small Pagination component matching Pages design
  const Pagination: React.FC<{
    pagination: PaginationState;
    onPageChange: (p: number) => void;
    loading: boolean;
  }> = ({ pagination, onPageChange, loading }) => {
    const { page: p, totalPages: tp, hasNext, hasPrev } = pagination;
    if (tp <= 1) return null;

    // compute pages to show (max 5)
    const pagesToShow = Math.min(5, tp);
    const pagesArr = Array.from({ length: pagesToShow }, (_, i) => {
      let pageNum;
      if (tp <= 5) {
        pageNum = i + 1;
      } else if (p <= 3) {
        pageNum = i + 1;
      } else if (p >= tp - 2) {
        pageNum = tp - 4 + i;
      } else {
        pageNum = p - 2 + i;
      }
      return pageNum;
    }).filter((n) => n >= 1 && n <= tp);

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">
          Showing page {p} of {tp}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(p - 1)}
            disabled={!hasPrev || loading}
            className={`p-2 rounded-lg border border-gray-300 transition-colors ${
              !hasPrev || loading
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "text-gray-600 hover:bg-gray-100 hover:border-gray-400"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {pagesArr.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`min-w-[2rem] px-2 py-1 text-sm rounded-lg transition-colors ${
                  p === pageNum
                    ? "bg-primary-600 text-white border border-primary-600"
                    : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(p + 1)}
            disabled={!hasNext || loading}
            className={`p-2 rounded-lg border border-gray-300 transition-colors ${
              !hasNext || loading
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "text-gray-600 hover:bg-gray-100 hover:border-gray-400"
            }`}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <CommonDashHeader
            title="Media Library"
            description="Upload, preview and manage images, videos, audio files and documents used across your site."
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by name or type..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none bg-white transition-all duration-200"
                aria-label="Search media"
              />
            </div>

            {/* Upload Button */}
            <label
              htmlFor="media-upload"
              className={`
                inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-200
                ${
                  isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }
                text-white
              `}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </>
              )}
              <input
                id="media-upload"
                type="file"
                accept={Object.keys(ACCEPTED_FILE_TYPES).join(",")}
                multiple
                onChange={handleInputChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {media.filter((item) => item.type.startsWith("image/")).length}
            </div>
            <div className="text-sm text-gray-600">Images (on page)</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {media.filter((item) => item.type.startsWith("video/")).length}
            </div>
            <div className="text-sm text-gray-600">Videos (on page)</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {
                media.filter(
                  (item) =>
                    !item.type.startsWith("image/") &&
                    !item.type.startsWith("video/")
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Other Files (on page)</div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="text-primary-800 text-sm font-medium">
                {error}
              </span>
            </div>
            <button
              onClick={clearError}
              className="text-primary-600 hover:text-primary-800 transition-colors p-1 rounded-lg hover:bg-red-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl outline-none bg-white text-sm font-medium text-gray-700 hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="all">All File Types</option>
                <option value="image/">Images</option>
                <option value="video/">Videos</option>
                <option value="audio/">Audio</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
              </div>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "name" | "date" | "size")
                }
                className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl outline-none bg-white text-sm font-medium text-gray-700 hover:border-gray-400 transition-all duration-200 appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2.5 border border-gray-300 rounded-xl hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 transition-all duration-200 group relative"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-medium transition-transform duration-200 ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                >
                  ↑
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-700">
                  {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </span>
              </div>

              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {sortOrder === "asc" ? "Ascending order" : "Descending order"}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Media Grid/List */}
        <section>
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600">Loading media library...</p>
              </div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-200">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No media found</h3>
              <p>
                {filter || fileTypeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Upload your first file to get started"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredMedia.map((item) => {
                const FileIcon = getFileIcon(item.type);
                const fileColor = getFileColor(item.type);
                const isUploadingItem = item.isLocal && isUploading;
                const progress = uploadProgress[item.name] || 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:border-gray-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <button
                        onClick={() => setPreview(item)}
                        className="w-full h-full flex items-center justify-center relative"
                        disabled={isUploadingItem}
                      >
                        {item.type.startsWith("image/") ? (
                          <img
                            src={item.src}
                            alt={item.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-3 text-white p-4">
                            <div
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${fileColor} flex items-center justify-center shadow-lg`}
                            >
                              <FileIcon className="w-8 h-8" />
                            </div>
                            <div className="text-xs font-medium uppercase tracking-wide bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                              {item.type.split("/")[1] || item.type}
                            </div>
                          </div>
                        )}

                        {/* Upload Progress Overlay */}
                        {isUploadingItem && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                            <div className="bg-white rounded-xl p-4 text-center shadow-2xl">
                              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                              <div className="text-sm font-medium text-gray-700">
                                {progress}%
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreview(item);
                              }}
                              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-lg"
                            >
                              <Eye className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item);
                              }}
                              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all transform hover:scale-110 shadow-lg"
                            >
                              <Download className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* File Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-semibold text-gray-900 truncate mb-1"
                            title={item.name}
                          >
                            {item.name}
                          </h3>
                          <div className="w-[12vw] flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatSize(item.sizeKb)}</span>
                            <span>•</span>
                            <span>{formatDate(item.uploadedAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyUrl(item)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={isUploadingItem}
                            className="p-2 rounded-lg hover:bg-gray-100 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Date Added
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMedia.map((item) => {
                    const FileIcon = getFileIcon(item.type);

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-8 h-8 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                          {item.type.split("/")[1] || item.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatSize(item.sizeKb)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(item.uploadedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setPreview(item)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDownload(item)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleCopyUrl(item)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Copy className="w-4 h-4 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pagination + limit selector */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1 || loading}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>

            <div className="px-3 py-2 rounded-lg border border-gray-200 bg-white">
              <span className="text-sm font-medium">
                Page <strong>{page}</strong> of {totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || loading}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Last
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              Showing {media.length} of {total} results
            </div>

            <div className="relative inline-block">
              <select
                value={limit}
                onChange={(e) => {
                  const newLimit = Number(e.target.value) || 20;
                  setLimit(newLimit);
                  setPage(1);
                }}
                className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-xl outline-none bg-white text-sm font-medium text-gray-700 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                aria-label="Items per page"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={40}>40 / page</option>
                <option value={100}>100 / page</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Compact pagination block matching Pages component */}
        <Pagination
          pagination={paginationState}
          onPageChange={onPageChange}
          loading={loading}
        />

        {/* Preview Modal */}
        {preview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-6xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">
                    {preview.name}
                  </h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{formatSize(preview.sizeKb)}</span>
                    <span>•</span>
                    <span>{formatDate(preview.uploadedAt)}</span>
                    <span>•</span>
                    <span className="font-mono text-xs">{preview.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleCopyUrl(preview)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(preview)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreview(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-gray-50">
                {preview.type.startsWith("image/") ? (
                  <img
                    src={preview.src}
                    alt={preview.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                ) : preview.type.startsWith("video/") ? (
                  <video
                    src={preview.src}
                    controls
                    className="max-w-full max-h-full rounded-lg shadow-lg"
                  />
                ) : preview.type.startsWith("audio/") ? (
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Music className="w-12 h-12 text-white" />
                      </div>
                      <audio src={preview.src} controls className="w-80" />
                      <button
                        onClick={() => handleDownload(preview)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <File className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-lg font-medium text-gray-700">
                        {preview.type}
                      </div>
                      <button
                        onClick={() => handleDownload(preview)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
