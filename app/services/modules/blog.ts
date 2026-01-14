import { getCookie } from "@/app/lib/cookies";
import { api } from "../apiClient";

export interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  cover?: string;
  tags?: string[];
  metaTitle: string;
  metaDescription: string;
  featured: boolean;
  status: "draft" | "published";
  publishedAt?: string | null;
  readingTime: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface BlogResponse {
  items: BlogItem[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface BlogCreatePayload {
  title: string;
  body: string;
  tags: string[];
  cover: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  status?: "draft" | "published";
}

export interface BlogUpdatePayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  cover?: string;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  tags?: string[];
  status?: "draft" | "published" | "scheduled" | "archived";
  publishedAt?: string | null;
}

export interface BlogCreateResponse {
  blog: BlogItem;
}

export interface BlogUpdateResponse {
  blog: BlogItem;
}

export interface BlogDeleteResponse {
  message: string;
  blogId: string;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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

const buildQueryString = (params: BlogQueryParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const getBlogs = async (
  params?: BlogQueryParams,
  opts?: ApiOptions
): Promise<BlogResponse> => {
  const queryString = params ? buildQueryString(params) : "";
  return api.get<BlogResponse>(
    `/admin/blogs${queryString}`,
    getRequestConfig(opts)
  );
};

export const getBlog = async (
  id: string,
  opts?: ApiOptions
): Promise<{ blog: BlogItem }> => {
  if (!id?.trim()) {
    throw new Error("Blog ID is required");
  }
  return api.get<{ blog: BlogItem }>(
    `/admin/blogs/${id}`,
    getRequestConfig(opts)
  );
};

export const getBlogBySlug = async (
  slug: string,
  opts?: ApiOptions
): Promise<{ blog: BlogItem }> => {
  if (!slug?.trim()) {
    throw new Error("Blog slug is required");
  }
  return api.get<{ blog: BlogItem }>(
    `/admin/blogs/slug/${slug}`,
    getRequestConfig(opts)
  );
};

export const createBlog = async (
  payload: BlogCreatePayload,
  opts?: ApiOptions
): Promise<BlogCreateResponse> => {
  if (!payload.title?.trim()) {
    throw new Error("Blog title is required");
  }

  return api.post<BlogCreateResponse>(
    "/admin/blogs",
    payload,
    getRequestConfig(opts)
  );
};

export const updateBlog = async (
  id: string,
  payload: BlogUpdatePayload,
  opts?: ApiOptions
): Promise<BlogUpdateResponse> => {
  if (!id?.trim()) {
    throw new Error("Blog ID is required");
  }

  return api.put<BlogUpdateResponse>(
    `/admin/blogs/${id}`,
    payload,
    getRequestConfig(opts)
  );
};

export const deleteBlog = async (
  id: string,
  opts?: ApiOptions
): Promise<BlogDeleteResponse> => {
  if (!id?.trim()) {
    throw new Error("Blog ID is required");
  }

  return api.del<BlogDeleteResponse>(
    `/admin/blogs/${id}`,
    getRequestConfig(opts)
  );
};

export const publishBlog = async (
  id: string,
  publishedAt?: string,
  opts?: ApiOptions
): Promise<BlogUpdateResponse> => {
  if (!id?.trim()) {
    throw new Error("Blog ID is required");
  }

  const payload: BlogUpdatePayload = {
    status: "published",
    ...(publishedAt && { publishedAt }),
  };

  return updateBlog(id, payload, opts);
};

export const archiveBlog = async (
  id: string,
  opts?: ApiOptions
): Promise<BlogUpdateResponse> => {
  if (!id?.trim()) {
    throw new Error("Blog ID is required");
  }

  return updateBlog(id, { status: "archived" }, opts);
};

export default {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  archiveBlog,
};
