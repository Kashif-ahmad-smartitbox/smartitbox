"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Mail,
  Search,
  RefreshCw,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Filter,
  FileText,
  ViewIcon,
} from "lucide-react";
import { ContactApi, FormSubmission } from "@/services/modules/contact";

import { useAlert } from "@/components/alerts/AlertProvider";
import { useModal } from "@/components/global/GlobalModalProvider";
import CommonDashHeader from "@/components/common/CommonDashHeader";
import { AuthContextType, useAuth } from "@/app/services/context/AuthContext";

const PAGE_LIMIT = 10;
const DEBOUNCE_DELAY = 300;

// Types
interface PaginationState {
  page: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Utility Functions
const formatDate = (iso?: string): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Components
const StatusBadge: React.FC<{ status: string }> = React.memo(({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "new":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };
      case "reviewed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          dot: "bg-green-500",
        };
      case "archived":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}
      aria-live="polite"
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} aria-hidden />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});
StatusBadge.displayName = "StatusBadge";

const SkeletonList: React.FC = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-8">
    <div className="animate-pulse space-y-4">
      {[...Array(PAGE_LIMIT)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Pagination: React.FC<{
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  loading: boolean;
}> = ({ pagination, onPageChange, loading }) => {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
      <div className="text-sm text-gray-500">
        Showing page {page} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
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
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={`min-w-8 px-2 py-1 text-sm rounded-lg transition-colors ${
                  page === pageNum
                    ? "bg-primary-600 text-white border border-primary-600"
                    : "text-gray-600 border border-gray-300 hover:bg-gray-100"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
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

const ContactRow: React.FC<{
  contact: FormSubmission;
  onView: (id: string) => void;
  onDelete: (contact: FormSubmission) => void;
  user: AuthContextType;
}> = React.memo(({ contact, onView, onDelete, user }) => {
  const handleViewClick = useCallback(
    () => contact._id && onView(contact._id),
    [contact._id, onView]
  );

  const handleDeleteClick = useCallback(
    () => onDelete(contact),
    [contact, onDelete]
  );

  // Extract form data for display
  const displayData = useMemo(() => {
    const { name, email, ...otherData } = contact.data || {};
    return {
      name: contact.name || name || "No name",
      email: contact.email || email || "No email",
      otherFields: Object.keys(otherData || {}).length,
    };
  }, [contact]);

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{displayData.name}</div>
            <div className="text-sm text-gray-500">{displayData.email}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">
            {contact.formName}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={contact.status || "new"} />
      </td>

      <td className="px-6 py-4 text-gray-500 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {displayData.otherFields} fields
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-gray-500 text-sm">
        {contact.referrer ? (
          <div className="max-w-[200px] truncate" title={contact.referrer}>
            {contact.urlRef || contact.referrer}
          </div>
        ) : (
          "—"
        )}
      </td>

      <td className="px-6 py-4 text-gray-500 w-[140px]">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 shrink-0" />
          {formatDate(contact.createdAt)}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleViewClick}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={`View ${displayData.email}`}
            aria-label={`View ${displayData.email}`}
          >
            <ViewIcon className="w-4 h-4" />
          </button>

          {user.user?.role === "super-admin" && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={`Delete ${displayData.email}`}
              aria-label={`Delete ${displayData.email}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});
ContactRow.displayName = "ContactRow";

const EmptyState: React.FC<{
  hasContacts: boolean;
  onRefresh: () => void;
}> = ({ hasContacts, onRefresh }) => (
  <div className="text-center py-12">
    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {hasContacts ? "No matching form submissions" : "No form submissions"}
    </h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      {hasContacts
        ? "Try adjusting your search or filter to find what you're looking for."
        : "You don't have any form submissions yet. They will appear here once people submit your forms."}
    </p>
    <button
      onClick={onRefresh}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      Refresh
    </button>
  </div>
);

const FormsPage: React.FC = () => {
  const [contacts, setContacts] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formNameFilter, setFormNameFilter] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { push } = useAlert();
  const modal = useModal();
  const user = useAuth();

  const fetchContacts = useCallback(
    async (page: number = 1, search: string = searchTerm) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: PAGE_LIMIT,
          search: search.trim() || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          formName: formNameFilter || undefined,
        };

        const res = await ContactApi.listSubmissions(params);

        setContacts(res.items || []);
        setPagination({
          page: res.page || page,
          total: res.total || 0,
          totalPages: Math.ceil((res.total || 0) / PAGE_LIMIT),
          hasNext:
            (res.page || page) < Math.ceil((res.total || 0) / PAGE_LIMIT),
          hasPrev: (res.page || page) > 1,
        });
      } catch (err: any) {
        console.error("Failed to load form submissions:", err);
        setError(
          err?.message || "Failed to fetch form submissions. Please try again."
        );
        setContacts([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        }));
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, statusFilter, formNameFilter]
  );

  // Debounced search
  const debouncedFetch = useMemo(
    () =>
      debounce(
        (page: number, search: string) => fetchContacts(page, search),
        DEBOUNCE_DELAY
      ),
    [fetchContacts]
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchContacts(1);
  }, [statusFilter, formNameFilter, fetchContacts]);

  // Search term changes with debouncing
  useEffect(() => {
    debouncedFetch(1, searchTerm);
  }, [searchTerm, debouncedFetch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= pagination.totalPages) {
        fetchContacts(newPage);
      }
    },
    [pagination.totalPages, fetchContacts]
  );

  const handleRefresh = useCallback(() => {
    fetchContacts(pagination.page);
  }, [fetchContacts, pagination.page]);

  const handleView = useCallback(
    async (id: string) => {
      try {
        const { submission } = await ContactApi.getSubmission(id);

        if (submission) {
          // Show detailed view in modal using the 'show' method
          modal.show({
            title: "Form Submission Details",
            body: (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Form Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {submission.formName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="mt-1">
                      <StatusBadge status={submission.status || "new"} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {submission.name || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">
                      {submission.email || "—"}
                    </p>
                  </div>
                </div>

                {submission.referrer && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Referrer
                    </label>
                    <p className="text-sm text-gray-900 break-all">
                      {submission.referrer}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Form Data
                  </label>
                  <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(submission.data || {}, null, 2)}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-500">Created</label>
                    <p className="text-gray-900">
                      {formatDate(submission.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-500">Updated</label>
                    <p className="text-gray-900">
                      {formatDate(submission.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ),
            size: "lg",
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch submission details:", err);
        push({
          title: "Error",
          message: err?.message || "Failed to load submission details.",
          variant: "error",
        });
      }
    },
    [modal, push]
  );

  const handleDelete = useCallback(
    async (contact: FormSubmission) => {
      if (!contact._id) return;

      const confirmed = await modal.confirm({
        title: "Delete Form Submission?",
        body: (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this form submission? This action
              cannot be undone.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                {contact.name || contact.data?.name || "No name"}
              </p>
              <p className="text-sm text-gray-500">
                {contact.email || contact.data?.email || "No email"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Form: {contact.formName}
              </p>
            </div>
          </div>
        ),
        confirmText: "Delete",
        cancelText: "Cancel",
      });

      if (confirmed) {
        setDeletingId(contact._id);
        try {
          await ContactApi.deleteSubmission(contact._id);
          push({
            title: "Success",
            message: "Form submission deleted successfully.",
            variant: "success",
          });
          fetchContacts(pagination.page);
        } catch (err: any) {
          console.error("Failed to delete form submission:", err);
          push({
            title: "Error",
            message: err?.message || "Failed to delete form submission.",
            variant: "error",
          });
        } finally {
          setDeletingId(null);
        }
      }
    },
    [modal, push, fetchContacts, pagination.page]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleStatusFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value);
    },
    []
  );

  const handleFormNameFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormNameFilter(e.target.value);
    },
    []
  );

  const exportContacts = useCallback(
    async (format: "json" | "csv" = "json") => {
      try {
        const blob = await ContactApi.exportSubmissions();

        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        // Get current date for filename
        const date = new Date().toISOString().split("T")[0];
        const extension = format === "json" ? "json" : "csv";
        a.download = `form-submissions-${date}.${extension}`;

        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        push({
          title: "Export Successful",
          message: `Form submissions data has been downloaded as ${extension.toUpperCase()}.`,
          variant: "success",
        });
      } catch (err: any) {
        console.error("Export failed:", err);
        push({
          title: "Export Failed",
          message: err?.message || "Failed to export form submissions data.",
          variant: "error",
        });
      }
    },
    [push]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CommonDashHeader
          title="Form Submissions"
          description="Manage and review your form submissions and contact requests."
        />
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              onChange={(e) => exportContacts(e.target.value as "json" | "csv")}
              className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none transition-colors cursor-pointer text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              defaultValue="json"
            >
              <option value="json">Export JSON</option>
              <option value="csv">Export CSV</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-4 h-4 text-gray-500"
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
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              loading ? "animate-spin opacity-60 cursor-wait" : ""
            }`}
            title="Refresh"
            aria-label="Refresh form submissions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search submissions by name, email, or form data..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none bg-white transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              aria-label="Search form submissions"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Filter by form..."
                value={formNameFilter}
                onChange={handleFormNameFilterChange}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none bg-white transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]"
                aria-label="Filter by form name"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="appearance-none bg-white pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg outline-none transition-colors cursor-pointer text-sm font-medium text-gray-700 hover:border-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 min-w-[140px]"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="archived">Archived</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="w-4 h-4 text-gray-500"
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
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 mb-2">{error}</div>
          <button
            onClick={handleRefresh}
            className="text-red-600 hover:text-red-700 text-sm font-medium underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {!loading && contacts.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {contacts.length} of {pagination.total} form submissions
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonList />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <ContactRow
                      key={contact._id}
                      contact={contact}
                      onView={handleView}
                      onDelete={handleDelete}
                      user={user}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {contacts.length === 0 && !loading && (
              <EmptyState
                hasContacts={pagination.total > 0}
                onRefresh={handleRefresh}
              />
            )}

            {/* Pagination */}
            {contacts.length > 0 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FormsPage;
