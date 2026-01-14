"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TeamApi, TeamMember, TeamResponse } from "@/services/modules/team";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  User,
  Shield,
  Edit3,
  Loader2,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import CommonDashHeader from "@/components/common/CommonDashHeader";
import { AuthContextType, useAuth } from "@/app/services/context/AuthContext";

interface TeamManagementProps {
  initialData?: TeamResponse;
}

interface DialogState {
  isOpen: boolean;
  type: "create" | "edit" | "delete" | null;
  member: TeamMember | null;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: TeamMember["role"];
}

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    icon: Shield,
    color: "text-red-600 bg-red-100 border-red-200",
    description: "Administrative access with most permissions",
  },
  editor: {
    icon: Edit3,
    label: "Editor",
    color: "text-blue-600 bg-blue-100 border-blue-200",
    description: "Can create and edit content",
  },
} as const;

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

const getInitialFormData = (member?: TeamMember | null): FormData => ({
  name: member?.name || "",
  email: member?.email || "",
  password: "",
  role: member?.role || "editor",
});

const RoleBadge: React.FC<{ role: TeamMember["role"] }> = ({ role }) => {
  const config = ROLE_CONFIG[role] || {
    label: "Super Admin",
    icon: Shield,
    color: "text-red-600 bg-red-100 border-red-200",
    description: "Administrative access with most permissions",
  };
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading team members...</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to load team
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const EmptyState: React.FC<{ onAddMember: () => void }> = ({ onAddMember }) => (
  <div className="text-center py-16 border border-gray-100 rounded-lg">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <User className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No team members yet
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Start building your team by adding the first member.
    </p>
    <button
      onClick={onAddMember}
      className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      <Plus className="w-5 h-5" />
      Add Team Member
    </button>
  </div>
);

const MemberForm: React.FC<{
  member?: TeamMember | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  user: AuthContextType;
  dialog: DialogState;
}> = ({ member, onSubmit, onCancel, loading, user, dialog }) => {
  const [formData, setFormData] = useState<FormData>(
    getInitialFormData(member)
  );
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!member && !formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(user.user?.email !== formData.email || dialog.type === "create") && (
        <>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </>
      )}

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password {!member && "*"}
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={
            member ? "Leave blank to keep current password" : "Enter password"
          }
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
        {!member && (
          <p className="mt-1 text-sm text-gray-500">
            Password must be at least 8 characters long
          </p>
        )}
      </div>
      {(user.user?.email !== formData.email || dialog.type === "create") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Role *
          </label>
          <div className="grid grid-cols-1 gap-3">
            {(
              Object.entries(ROLE_CONFIG) as [
                TeamMember["role"],
                (typeof ROLE_CONFIG)[keyof typeof ROLE_CONFIG]
              ][]
            ).map(([role, config]) => {
              const Icon = config.icon;
              return (
                <label
                  key={role}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.role === role
                      ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-opacity-20"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={(e) =>
                      handleChange("role", e.target.value as TeamMember["role"])
                    }
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${config.color.split(" ")[1]}`}
                    >
                      <Icon
                        className={`w-4 h-4 ${config.color.split(" ")[0]}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {config.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {config.description}
                      </div>
                    </div>
                  </div>
                  {formData.role === role && (
                    <Check className="w-5 h-5 text-primary-600" />
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {member ? "Update Member" : "Add Member"}
        </button>
      </div>
    </form>
  );
};

function Team({ initialData }: TeamManagementProps) {
  const user = useAuth();

  const [teamData, setTeamData] = useState<TeamResponse | null>(
    initialData || null
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: null,
    member: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await TeamApi.list(1, 50);
      setTeamData(response);
    } catch (err) {
      console.error("Failed to fetch team data:", err);
      setError(err instanceof Error ? err.message : "Failed to load team data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      fetchTeamData();
    }
  }, [initialData, fetchTeamData]);

  const handleCreateMember = async (formData: FormData) => {
    try {
      setActionLoading(true);
      await TeamApi.create(formData);
      await fetchTeamData();
      setDialog({ isOpen: false, type: null, member: null });
    } catch (err) {
      console.error("Failed to create member:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create team member"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateMember = async (formData: FormData) => {
    if (!dialog.member?._id) return;

    try {
      setActionLoading(true);
      const updateData: Partial<TeamMember & { password?: string }> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await TeamApi.update(dialog.member._id, updateData);
      await fetchTeamData();
      setDialog({ isOpen: false, type: null, member: null });
    } catch (err) {
      console.error("Failed to update member:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update team member"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!dialog.member?._id) return;

    try {
      setActionLoading(true);
      await TeamApi.delete(dialog.member._id);
      await fetchTeamData();
      setDialog({ isOpen: false, type: null, member: null });
    } catch (err) {
      console.error("Failed to delete member:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete team member"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openDialog = (type: DialogState["type"], member?: TeamMember) => {
    setDialog({
      isOpen: true,
      type,
      member: member || null,
    });
  };

  const closeDialog = () => {
    setDialog({
      isOpen: false,
      type: null,
      member: null,
    });
  };

  const filteredMembers =
    teamData?.items.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (loading) return <LoadingState />;
  if (error && !teamData)
    return <ErrorState error={error} onRetry={fetchTeamData} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <CommonDashHeader
            title="Team Management"
            description="Manage your team members and their permissions"
          />
        </div>
        {/* Actions Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button
                onClick={() => openDialog("create")}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {filteredMembers.length === 0 && teamData?.items.length === 0 ? (
            <EmptyState onAddMember={() => openDialog("create")} />
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No members found
              </h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={member.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {member.createdAt
                          ? new Date(member.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.user?.role === "super-admin" && (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openDialog("edit", member)}
                              className="text-primary-600 hover:text-primary-900 p-1 rounded transition-colors"
                              title="Edit member"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDialog("delete", member)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              title="Delete member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {dialog.isOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-md w-full max-h-[90vh] overflow-y-auto">
              {(dialog.type === "create" || dialog.type === "edit") && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {dialog.type === "create"
                        ? "Add Team Member"
                        : "Edit Team Member"}
                    </h2>
                    <button
                      onClick={closeDialog}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <MemberForm
                    dialog={dialog}
                    member={dialog.member}
                    onSubmit={
                      dialog.type === "create"
                        ? handleCreateMember
                        : handleUpdateMember
                    }
                    onCancel={closeDialog}
                    loading={actionLoading}
                    user={user}
                  />
                </div>
              )}

              {dialog.type === "delete" && dialog.member && (
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Delete Team Member
                      </h2>
                      <p className="text-gray-600">
                        This action cannot be undone
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 font-medium">
                      Are you sure you want to delete {dialog.member.name}?
                    </p>
                    <p className="text-red-700 text-sm mt-1">
                      This will permanently remove their access to the system.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={closeDialog}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteMember}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {actionLoading && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      Delete Member
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;
