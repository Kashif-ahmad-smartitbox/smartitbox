import { getCookie } from "@/app/lib/cookies";
import { api } from "../apiClient";

export interface StoryItem {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  body: string;
  image: string;
  featured: boolean;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoryResponse {
  items: StoryItem[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface StoryCreatePayload {
  title: string;
  subtitle: string;
  body: string;
  tags: string[];
  image: string;
  status: string;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
}

export interface StoryUpdatePayload {
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  image: string;
  featured: boolean;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
}

export interface StoryCreateResponse {
  story: StoryItem;
}

export interface StoryUpdateResponse {
  story: StoryItem;
}

export interface StoryDeleteResponse {
  message: string;
  storyId: string;
}

export interface StoryQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  featured?: boolean;
}

export interface ApiOptions {
  useCookies?: boolean;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

const getRequestConfig = (opts?: ApiOptions): RequestInit => {
  const token = getCookie("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts?.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return {
    headers,
    ...(opts?.signal ? { signal: opts.signal } : {}),
    ...(opts?.useCookies ? { credentials: "include" } : {}),
  };
};

const buildQueryString = (params: StoryQueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const getStories = async (
  params?: StoryQueryParams,
  opts?: ApiOptions
): Promise<StoryResponse> => {
  const queryString = params ? buildQueryString(params) : "";

  return api.get<StoryResponse>(
    `/admin/stories${queryString}`,
    getRequestConfig(opts)
  );
};

export const getStory = async (
  id: string,
  opts?: ApiOptions
): Promise<{ story: StoryItem }> => {
  if (!id) {
    throw new Error("Story ID is required");
  }
  return api.get<{ story: StoryItem }>(
    `/admin/stories/${id}`,
    getRequestConfig(opts)
  );
};

export const createStory = async (
  payload: StoryCreatePayload,
  opts?: ApiOptions
): Promise<StoryCreateResponse> => {
  if (!payload.title?.trim()) {
    throw new Error("Story title is required");
  }

  return api.post<StoryCreateResponse>(
    "/admin/stories",
    payload,
    getRequestConfig(opts)
  );
};

export const updateStory = async (
  id: string,
  payload: StoryUpdatePayload,
  opts?: ApiOptions
): Promise<StoryUpdateResponse> => {
  if (!id) {
    throw new Error("Story ID is required");
  }

  return api.put<StoryUpdateResponse>(
    `/admin/stories/${id}`,
    payload,
    getRequestConfig(opts)
  );
};

export const deleteStory = async (
  id: string,
  opts?: ApiOptions
): Promise<StoryDeleteResponse> => {
  if (!id) {
    throw new Error("Story ID is required");
  }

  return api.del<StoryDeleteResponse>(
    `/admin/stories/${id}`,
    getRequestConfig(opts)
  );
};

export default {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory,
};
