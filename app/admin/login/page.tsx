"use client";

import { useRouter } from "next/navigation";
import { setCookie } from "@/app/lib/cookies";
import React, { useState, useCallback } from "react";
import { adminLogin } from "@/app/services/modules/auth";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  LogIn,
  Loader2,
  Key,
} from "lucide-react";

type FormState = { email: string; password: string };

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = useCallback((): boolean => {
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    return true;
  }, [formData]);

  const handleInputChange = useCallback(
    (field: keyof FormState, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (error) setError(null);
    },
    [error]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;
    setLoading(true);

    try {
      const data = await adminLogin(formData);

      if (!data?.accessToken) {
        throw new Error("Login failed. Invalid credentials.");
      }

      setCookie("token", data.accessToken, 7, "/", "Lax");
      window.location.replace("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((s) => !s);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-white to-primary-50/50 p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        {/* Main Card with Glass Effect */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl shadow-slate-300/20 p-8 sm:p-10">
          {/* Logo & Header Section */}
          <div className="text-center mb-10">
            <div className="w-full flex justify-center items-center mb-5">
              <img className="w-48" src="/logo.png" alt="logo" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-xs">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-red-50/80 to-orange-50/80 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Authentication Error</p>
                <p className="text-red-600/80 text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:border-gray-300 group-hover:border-primary-300"
                  placeholder="admin@smartitbox.in"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-gray-900 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:border-gray-300 group-hover:border-primary-300"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-300" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 text-white font-semibold rounded-xl py-3.5 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-primary-500/20 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600 shadow-lg hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-90 disabled:cursor-not-allowed disabled:hover:scale-100 group`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              SMARTITBOX © {new Date().getFullYear()} All rights reserved
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Admin Portal v2.1.0 • Secure Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
