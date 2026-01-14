import { API_BASE_URL } from "../api";
import { api } from "../apiClient";

export type ImportResult = {
  success: boolean;
  message?: string;
  processed?: number;
  errors?: string[];
  raw?: any;
};

function buildAuthHeaders(token?: string, cookie?: string): Headers {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (cookie) headers.set("Cookie", cookie);
  return headers;
}

function buildAuthHeaderObject(token?: string, cookie?: string) {
  const h: Record<string, string> = {};
  if (token) h["Authorization"] = `Bearer ${token}`;
  if (cookie) h["Cookie"] = cookie;
  return h;
}

export async function exportCollectionsDownload(
  collections: string[] = ["pages", "modules", "media"],
  token?: string,
  cookie?: string,
  autoDownload = true
): Promise<Blob | { success: false; message: string }> {
  const q = collections.length ? collections.join(",") : "all";
  const url = `${API_BASE_URL}/admin/backup/export?collections=${encodeURIComponent(
    q
  )}`;

  const headers = buildAuthHeaders(token, cookie);

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, message: `Export failed: ${res.status} ${text}` };
  }

  const blob = await res.blob();
  if (autoDownload && typeof window !== "undefined") {
    const filename =
      res.headers
        .get("Content-Disposition")
        ?.match(/filename="?([^"]+)"?/)?.[1] ||
      `smartitbox-backup-${Date.now()}.ndjson`;
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  }

  return blob;
}

export async function importNdjson(
  file: File,
  mode: "insert" | "upsert" | "replace" = "upsert",
  token?: string,
  cookie?: string,
  progressCb?: (loaded: number, total: number) => void
): Promise<ImportResult> {
  const url = `${API_BASE_URL}/admin/backup/import?mode=${encodeURIComponent(
    mode
  )}`;

  return new Promise<ImportResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    if (cookie) xhr.setRequestHeader("Cookie", cookie);

    xhr.withCredentials = true;

    xhr.upload.onprogress = (ev) => {
      if (progressCb && ev.lengthComputable) {
        progressCb(ev.loaded, ev.total);
      }
    };

    xhr.onload = () => {
      try {
        const contentType = xhr.getResponseHeader("Content-Type") || "";
        if (xhr.status >= 200 && xhr.status < 300) {
          if (contentType.includes("application/json")) {
            const json = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              raw: json,
              processed: json.processed,
              errors: json.errors,
              message: json.message,
            });
          } else {
            resolve({
              success: true,
              message: "Import finished (no JSON response)",
            });
          }
        } else {
          const txt = xhr.responseText;
          try {
            const errJson = JSON.parse(txt);
            reject({ success: false, message: errJson.message || txt });
          } catch {
            reject({
              success: false,
              message: `Import failed: ${xhr.status} ${txt}`,
            });
          }
        }
      } catch (e) {
        reject({ success: false, message: String(e) });
      }
    };

    xhr.onerror = () => {
      reject({ success: false, message: "Network error during import" });
    };

    const form = new FormData();
    form.append("file", file);

    xhr.send(form);
  });
}

export async function exportBinaryDumpDownload(
  token?: string,
  cookie?: string,
  autoDownload = true
): Promise<Blob | { success: false; message: string }> {
  const url = `${API_BASE_URL}/admin/backup/export-tar`;
  const headers = buildAuthHeaders(token, cookie);

  const res = await fetch(url, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      success: false,
      message: `Binary export failed: ${res.status} ${text}`,
    };
  }

  const blob = await res.blob();
  if (autoDownload && typeof window !== "undefined") {
    const filename =
      res.headers
        .get("Content-Disposition")
        ?.match(/filename="?([^"]+)"?/)?.[1] ||
      `smartitbox-dump-${Date.now()}.archive.gz`;
    const urlObj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(urlObj);
  }

  return blob;
}

export async function importBinaryDump(
  file: File,
  token?: string,
  cookie?: string,
  progressCb?: (loaded: number, total: number) => void
): Promise<ImportResult> {
  const url = `${API_BASE_URL}/admin/backup/import-tar`;

  return new Promise<ImportResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    if (cookie) xhr.setRequestHeader("Cookie", cookie);

    xhr.withCredentials = true;

    xhr.upload.onprogress = (ev) => {
      if (progressCb && ev.lengthComputable) progressCb(ev.loaded, ev.total);
    };

    xhr.onload = () => {
      try {
        const contentType = xhr.getResponseHeader("Content-Type") || "";
        if (xhr.status >= 200 && xhr.status < 300) {
          if (contentType.includes("application/json")) {
            const json = JSON.parse(xhr.responseText);
            resolve({ success: true, raw: json, message: json.message });
          } else {
            resolve({
              success: true,
              message: "Import finished (no JSON response)",
            });
          }
        } else {
          const txt = xhr.responseText;
          try {
            const errJson = JSON.parse(txt);
            reject({ success: false, message: errJson.message || txt });
          } catch {
            reject({
              success: false,
              message: `Import failed: ${xhr.status} ${txt}`,
            });
          }
        }
      } catch (e) {
        reject({ success: false, message: String(e) });
      }
    };

    xhr.onerror = () => {
      reject({ success: false, message: "Network error during import" });
    };

    const form = new FormData();
    form.append("file", file);

    xhr.send(form);
  });
}

export const listBackups = async (): Promise<any> => {
  return api.get("/admin/backup/list");
};

export default {
  exportCollectionsDownload,
  importNdjson,
  exportBinaryDumpDownload,
  importBinaryDump,
  listBackups,
  buildAuthHeaderObject,
};
