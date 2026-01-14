import { api } from "../apiClient";

export type User = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  [k: string]: any;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken?: string;
  user?: User;
  message?: string;
};

export type ProfileResponse = {
  user?: User;
};

export type RefreshResponse = {
  accessToken: string;
};

export type LogoutResponse = {
  success: boolean;
  message?: string;
};

export const adminLogin = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  return api.post<LoginResponse>("/admin/login", credentials);
};

export const refreshToken = async (): Promise<RefreshResponse> => {
  return api.get<RefreshResponse>("/admin/refresh");
};

export const adminLogout = async (): Promise<LogoutResponse> => {
  return api.post<LogoutResponse>("/admin/logout", {});
};

export const getAdminProfile = async (
  token?: string
): Promise<ProfileResponse> => {
  if (token) {
    return api.get<ProfileResponse>("/admin/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  return api.get<ProfileResponse>("/admin/me");
};

export default {
  adminLogin,
  adminLogout,
  getAdminProfile,
  refreshToken,
};
