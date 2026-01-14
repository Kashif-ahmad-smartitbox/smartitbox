import { getCookie } from "@/app/lib/cookies";
import { api } from "../apiClient";

export interface ModuleCreatePayload {
  type: string;
  title?: string;
  content?: any;
  status?: "draft" | "published";
}

export interface Module {
  _id: string;
  type: string;
  title?: string;
  content?: any;
  status?: "draft" | "published";
  version?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  [k: string]: any;
}

export interface ModuleResponse {
  module: Module;
}

export type ModuleUpdatePayload = Partial<ModuleCreatePayload>;

export type ModuleRequestOptions = {
  token?: string | null;
  useCookies?: boolean;
  signal?: AbortSignal | null;
};

export type ModuleItem = {
  _id: string;
  type: string;
  title: string;
  status: string;
  content: any;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type moduleRes = {
  items: ModuleItem[];
};

function buildRequestOptions(opts?: ModuleRequestOptions): RequestInit {
  const token = getCookie("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return {
    headers,
    ...(opts?.signal ? { signal: opts.signal } : {}),
    ...(opts?.useCookies ? { credentials: "include" } : {}),
  };
}

export const getModule = async (
  id: string,
  opts?: ModuleRequestOptions
): Promise<ModuleResponse> => {
  if (!id?.trim()) {
    throw new Error("Module ID is required");
  }

  const requestInit = buildRequestOptions(opts);
  return api.get<ModuleResponse>(`/admin/modules/${id}`, requestInit);
};

export const getModuleById = async (
  id: string,
  opts?: ModuleRequestOptions
): Promise<Module> => {
  if (!id?.trim()) {
    throw new Error("Module ID is required");
  }

  const requestInit = buildRequestOptions(opts);
  const response = await api.get<ModuleResponse>(
    `/admin/modules/${id}`,
    requestInit
  );

  if (!response.module) {
    throw new Error("Module not found in response");
  }

  return response.module;
};

export const createModule = async (
  payload: ModuleCreatePayload,
  opts?: ModuleRequestOptions
): Promise<ModuleResponse> => {
  const requestInit = buildRequestOptions(opts);
  return api.post<ModuleResponse>("/admin/modules", payload, requestInit);
};

export const updateModule = async (
  id: string,
  payload: ModuleUpdatePayload,
  opts?: ModuleRequestOptions
): Promise<ModuleResponse> => {
  if (!id) throw new Error("updateModule: id is required");
  const requestInit = buildRequestOptions(opts);
  return api.put<ModuleResponse>(`/admin/modules/${id}`, payload, requestInit);
};

export const getModules = async () => {
  return api.get<moduleRes>("/admin/modules?limit=400");
};

export default {
  createModule,
  updateModule,
  getModule,
  getModuleById,
  getModules,
};
