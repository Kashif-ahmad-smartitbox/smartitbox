import { api } from "../apiClient";
import { getCookie } from "@/app/lib/cookies";
import { API_BASE_URL } from "../api";

export type FormSubmission = {
  _id?: string;
  formName: string;
  data: Record<string, any>;
  email?: string;
  name?: string;
  urlRef?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  honeypot?: string | null;
  status?: "new" | "reviewed" | "archived";
  createdAt?: string;
  updatedAt?: string;
};

export type SubmitFormPayload = {
  formName: string;
  data?: Record<string, any>;
  email?: string;
  name?: string;
  urlRef?: string;
  honeypot?: string | null;
  recaptchaToken?: string;
};

export type SubmitFormResult = {
  message: string;
  id?: string;
};

export type ListParams = {
  page?: number;
  limit?: number;
  formName?: string;
  status?: string;
  search?: string;
};

export type ListResponse = {
  items?: FormSubmission[];
  total?: number;
  page?: number;
  limit?: number;
};

/** Build headers object that contains only string values (no undefined). */
const buildAuthHeader = async (): Promise<Record<string, string>> => {
  const token = await getCookie("token");
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const ContactApi = {
  /**
   * Public: submit a form
   * POST /forms/submit
   */
  async submitForm(payload: SubmitFormPayload): Promise<SubmitFormResult> {
    return api.post<SubmitFormResult>("/forms/submit", payload);
  },

  /**
   * Admin: list form submissions
   * GET /api/forms
   */
  async listSubmissions(params: ListParams = {}): Promise<ListResponse> {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.formName) qs.set("formName", params.formName);
    if (params.status) qs.set("status", params.status);
    if (params.search) qs.set("search", params.search);

    const headers = await buildAuthHeader();
    return api.get<ListResponse>(`/forms?${qs.toString()}`, {
      headers,
    });
  },

  /**
   * Admin: get one submission
   * GET /api/forms/:id
   */
  async getSubmission(id: string): Promise<{ submission?: FormSubmission }> {
    const headers = await buildAuthHeader();
    return api.get<{ submission?: FormSubmission }>(
      `/forms/${encodeURIComponent(id)}`,
      {
        headers,
      }
    );
  },

  /**
   * Admin: delete a submission
   * DELETE /api/forms/:id
   */
  async deleteSubmission(id: string): Promise<{ message: string }> {
    const headers = await buildAuthHeader();
    return api.del<{ message: string }>(`/forms/${encodeURIComponent(id)}`, {
      headers,
    });
  },

  /**
   * Admin: export submissions as NDJSON (download Blob)
   * GET /api/forms-export
   */
  async exportSubmissions(): Promise<Blob> {
    const token = await getCookie("accessToken");
    const url = `${API_BASE_URL}/forms-export`;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Export failed: ${res.status} ${txt}`);
    }

    return res.blob();
  },

  /**
   * Convenience: trigger binary export (mongodump) — if you have route for it
   * GET /api/backup/export-tar  (optional, only if backend exposes)
   */
  async exportBinaryDump(): Promise<Blob> {
    const token = await getCookie("token");
    const url = `${API_BASE_URL}/forms-export`;
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Binary export failed: ${res.status} ${txt}`);
    }

    return res.blob();
  },
};

export default ContactApi;
