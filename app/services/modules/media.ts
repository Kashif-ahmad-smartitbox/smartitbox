import { API_BASE_URL } from "../api";
import { api } from "../apiClient";

export type MediaItem = {
  _id?: string;
  id?: string;
  filename?: string;
  url?: string;
  size?: number;
  mimeType?: string;
  createdAt?: string;
  [k: string]: any;
};

export type UploadResult = {
  success: boolean;
  data?: MediaItem | MediaItem[];
  message?: string;
};

export type MediaListResponse = {
  items: MediaItem[];
  total: number;
  page: number;
  limit: number;
};

function buildAuthHeaders(token?: string, cookie?: string): Headers {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (cookie) headers.set("Cookie", cookie);
  return headers;
}

export const getAllMedia = async (): Promise<MediaItem[]> => {
  // Backwards compatible: fetch first page with a reasonably large limit
  const resp = await listMedia(1, 100);
  return resp.items;
};

export const getMediaById = async (id: string): Promise<MediaItem> => {
  return api.get<MediaItem>(`/admin/uploads/media/${encodeURIComponent(id)}`);
};

export const listMedia = async (
  page: number = 1,
  limit: number = 20,
  token?: string,
  cookie?: string
): Promise<MediaListResponse> => {
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)));

  const qs = new URLSearchParams({
    page: String(safePage),
    limit: String(safeLimit),
  }).toString();

  const url = `${API_BASE_URL}/admin/uploads/media?${qs}`;
  const headers = buildAuthHeaders(token, cookie);

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`listMedia failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as MediaListResponse;
  // sanitize/ensure fields exist
  return {
    items: data.items ?? [],
    total: typeof data.total === "number" ? data.total : 0,
    page: typeof data.page === "number" ? data.page : safePage,
    limit: typeof data.limit === "number" ? data.limit : safeLimit,
  };
};

export const uploadMedia = async (
  file: File | Blob,
  token?: string,
  cookie?: string
): Promise<UploadResult> => {
  const url = `${API_BASE_URL}/admin/uploads/media`;
  const form = new FormData();
  form.append("file", file);

  const headers = buildAuthHeaders(token, cookie);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, message: `Upload failed: ${res.status} ${text}` };
  }

  const data = await res.json();
  return { success: true, data };
};

export const uploadMultipleMedia = async (
  files: (File | Blob)[],
  token?: string,
  cookie?: string
): Promise<UploadResult> => {
  const url = `${API_BASE_URL}/admin/uploads/media/multi`;
  const form = new FormData();
  files.forEach((f) => form.append("files", f));

  const headers = buildAuthHeaders(token, cookie);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      success: false,
      message: `Multi upload failed: ${res.status} ${text}`,
    };
  }

  const data = await res.json();
  return { success: true, data };
};

export const deleteMedia = async (
  id: string,
  token?: string,
  cookie?: string
): Promise<{ success: boolean; message?: string }> => {
  const url = `${API_BASE_URL}/admin/uploads/media/${encodeURIComponent(id)}`;
  const headers = buildAuthHeaders(token, cookie);

  const res = await fetch(url, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, message: `Delete failed: ${res.status} ${text}` };
  }

  try {
    const json = await res.json();
    return { success: true, message: json?.message ?? undefined };
  } catch {
    return { success: true };
  }
};

export const buildAuthHeaderObject = (token?: string, cookie?: string) => {
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  if (cookie) h["Cookie"] = cookie;
  return h;
};

export default {
  getAllMedia,
  getMediaById,
  listMedia,
  uploadMedia,
  uploadMultipleMedia,
  deleteMedia,
  buildAuthHeaderObject,
};
