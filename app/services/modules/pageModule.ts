import { getCookie } from "@/app/lib/cookies";
import { api, ApiError } from "../apiClient";

export interface PageItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  status: "draft" | "published" | "archived";
  type: "default" | "solutions" | "services" | "policies";
  publishedAt?: string;
  layout: {
    moduleId: string;
    order: number;
    module?: {
      _id: string;
      name: string;
      type: string;
      content: any;
      status: "published" | "draft";
    };
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PageItem2 {
  page: {
    canonicalUrl: string;
    createdAt: string;
    createdBy: string;
    excerpt: string;
    layout: {
      moduleId: string;
      order: number;
    }[];
    metaDescription: string;
    metaTitle: string;
    publishedAt: string;
    slug: string;
    status: string;
    title: string;
    _id: string;
  };
}

export interface PageResponse {
  items: PageItem[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PageWithContentResponse {
  page: PageItem | null;
  message?: string;
}

export interface PageUpdatePayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  status?: "draft" | "published" | "archived";
  publishedAt?: string | null;
  layout?: { moduleId: string; order: number }[];
}

export interface PageUpdateResponse {
  page: PageItem;
  success: boolean;
  message?: string;
}

export interface RequestOptions {
  useCookies?: boolean;
  signal?: AbortSignal;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

const CACHE_DURATION = 1000 * 10;

class PageService {
  private cache = new Map<string, { data: any; timestamp: number }>();

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    return `${endpoint}:${JSON.stringify(params || {})}`;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const token = getCookie("token");

    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    };

    // Build request options for the api client
    const requestOptions: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
      ...(options.signal && { signal: options.signal }),
      ...(options.useCookies && {
        credentials: "include" as RequestCredentials,
      }),
    };

    try {
      // Use the appropriate api method based on HTTP method
      switch (method) {
        case "GET":
          return await api.get<T>(endpoint, requestOptions);
        case "POST":
          return await api.post<T>(endpoint, data, requestOptions);
        case "PUT":
          return await api.put<T>(endpoint, data, requestOptions);
        case "DELETE":
          return await api.del<T>(endpoint, requestOptions);
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);

      // Enhance the error with additional context
      if (error instanceof Error) {
        const enhancedError = error as ApiError;
        enhancedError.url = endpoint;
        throw enhancedError;
      }

      throw new Error(`Request failed: ${error}`);
    }
  }

  async getPages(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PageResponse> {
    const cacheKey = this.getCacheKey("/admin/pages", params);
    const cached = this.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    const queryParams = new URLSearchParams();
    if (params?.page != null)
      queryParams.append("page", params.page.toString());
    if (params?.limit != null)
      queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const endpoint = `/admin/pages${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    const data = await this.makeRequest<PageResponse>("GET", endpoint);

    this.setCache(cacheKey, data);
    return data;
  }

  async getPage(id: string, options?: RequestOptions): Promise<PageItem2> {
    const cacheKey = this.getCacheKey(`/admin/pages/${id}`);
    const cached = this.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    const data = await this.makeRequest<PageItem2>(
      "GET",
      `/admin/pages/${id}`,
      undefined,
      options
    );

    console.log("data", data);

    this.setCache(cacheKey, data);
    return data;
  }

  async getPageWithContent(
    slug: string,
    options?: RequestOptions
  ): Promise<PageWithContentResponse> {
    const cacheKey = this.getCacheKey(`/admin/pages/slug/${slug}`);
    const cached = this.getCache(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const data = await this.makeRequest<PageWithContentResponse>(
        "GET",
        `/admin/pages/slug/${slug}`,
        undefined,
        options
      );

      this.setCache(cacheKey, data);
      return data;
    } catch (error: any) {
      // Handle 404 errors gracefully
      if (error.status === 404) {
        const notFoundResponse: PageWithContentResponse = {
          page: null,
          message: "Not found",
        };
        this.setCache(cacheKey, notFoundResponse);
        return notFoundResponse;
      }
      throw error;
    }
  }

  async updatePage(
    id: string,
    payload: PageUpdatePayload,
    options: RequestOptions = {}
  ): Promise<PageUpdateResponse> {
    // Clear relevant caches
    this.clearCache();

    const data = await this.makeRequest<PageUpdateResponse>(
      "PUT",
      `/admin/pages/${id}`,
      payload,
      options
    );

    return data;
  }

  async createPage(
    payload: Omit<PageUpdatePayload, "id">,
    options?: RequestOptions
  ): Promise<PageUpdateResponse> {
    this.clearCache();

    const data = await this.makeRequest<PageUpdateResponse>(
      "POST",
      "/admin/pages",
      payload,
      options
    );

    return data;
  }

  async deletePage(
    id: string,
    options?: RequestOptions
  ): Promise<{ success: boolean; message: string }> {
    this.clearCache();

    const data = await this.makeRequest<{ success: boolean; message: string }>(
      "DELETE",
      `/admin/pages/${id}`,
      undefined,
      options
    );

    return data;
  }

  // Utility method to clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Method to get cache statistics (useful for debugging)
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const pageService = new PageService();

export const getPages = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => pageService.getPages(params);

export const getPage = (id: string, options?: RequestOptions) =>
  pageService.getPage(id, options);

export const getPageWithContent = (slug: string, options?: RequestOptions) =>
  pageService.getPageWithContent(slug, options);

export const updatePage = (
  id: string,
  payload: PageUpdatePayload,
  options?: RequestOptions
) => pageService.updatePage(id, payload, options);

export const createPage = (
  payload: Omit<PageUpdatePayload, "id">,
  options?: RequestOptions
) => pageService.createPage(payload, options);

export const deletePage = (id: string, options?: RequestOptions) =>
  pageService.deletePage(id, options);

export default pageService;
