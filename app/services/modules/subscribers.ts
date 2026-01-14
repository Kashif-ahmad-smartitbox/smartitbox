import { api } from "../apiClient";
import { getCookie } from "@/app/lib/cookies";

export interface Subscriber {
  _id?: string;
  email: string;
  name?: string;
  tags?: string[];
  source?: string;
  status?: "subscribed" | "unsubscribed" | "bounced";
  unsubscribeToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriberResponse {
  subscriber?: Subscriber;
  subscribers?: Subscriber[];
  items?: Subscriber[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
}

export interface SubscribePayload {
  email: string;
  name?: string;
  tags?: string[];
  source?: string;
}

export const SubscribersApi = {
  async subscribe(payload: SubscribePayload): Promise<SubscriberResponse> {
    return api.post<SubscriberResponse>("/subscribers", payload);
  },

  async unsubscribe(token: string): Promise<SubscriberResponse> {
    return api.post<SubscriberResponse>("/subscribers/unsubscribe", { token });
  },

  async list(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    tag?: string;
  }): Promise<SubscriberResponse> {
    const token = await getCookie("token");
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.tag) query.append("tag", params.tag);

    return api.get<SubscriberResponse>(`/subscribers?${query.toString()}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },

  async getById(id: string): Promise<SubscriberResponse> {
    const token = await getCookie("token");
    return api.get<SubscriberResponse>(`/subscribers/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },

  async update(
    id: string,
    payload: Partial<Subscriber>
  ): Promise<SubscriberResponse> {
    const token = await getCookie("token");
    return api.put<SubscriberResponse>(`/subscribers/${id}`, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    const token = await getCookie("token");
    return api.del<{ message: string }>(`/subscribers/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },

  async exportAll(): Promise<Blob> {
    const token = await getCookie("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribers-export`,
      {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Export failed: ${res.status} ${text}`);
    }

    return res.blob();
  },
};

export default SubscribersApi;
