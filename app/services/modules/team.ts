import { getCookie } from "@/app/lib/cookies";
import { API_BASE_URL } from "../api";

export type TeamMemberRole = "admin" | "editor";

export interface TeamMember {
  _id?: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamResponse {
  items: TeamMember[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTeamMemberRequest {
  name: string;
  email: string;
  password: string;
  role: TeamMemberRole;
}

export interface UpdateTeamMemberRequest {
  name?: string;
  email?: string;
  role?: TeamMemberRole;
  password?: string;
}

// Simple API Service
export const TeamApi = {
  async list(page: number = 1, limit: number = 20): Promise<TeamResponse> {
    const token = await getCookie("token");
    const query = `page=${page}&limit=${limit}`;

    const response = await fetch(`${API_BASE_URL}/admin/team?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch team members");
    return await response.json();
  },

  async create(member: CreateTeamMemberRequest): Promise<TeamMember> {
    const token = await getCookie("token");

    const response = await fetch(`${API_BASE_URL}/admin/team`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    });

    if (!response.ok) throw new Error("Failed to create team member");
    return await response.json();
  },

  async get(id: string): Promise<{ member: TeamMember }> {
    const token = await getCookie("token");

    const response = await fetch(`${API_BASE_URL}/admin/team/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch team member");
    return await response.json();
  },

  async update(id: string, data: UpdateTeamMemberRequest): Promise<TeamMember> {
    const token = await getCookie("token");

    const response = await fetch(`${API_BASE_URL}/admin/team/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update team member");
    return await response.json();
  },

  async delete(id: string): Promise<void> {
    const token = await getCookie("token");

    const response = await fetch(`${API_BASE_URL}/admin/team/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to delete team member");
  },
};

export default TeamApi;
