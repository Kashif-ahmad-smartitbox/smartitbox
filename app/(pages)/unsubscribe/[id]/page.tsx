"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SubscribersService from "@/services/modules/subscribers";
import { CheckCircle, AlertTriangle, Home } from "lucide-react";

type UnsubscribeStatus = "idle" | "loading" | "success" | "error";

export default function UnsubscribePage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<UnsubscribeStatus>("loading");
  const [message, setMessage] = useState<string>("");

  const token = params.id as string;

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid unsubscribe link");
      return;
    }

    const unsubscribe = async () => {
      try {
        const response = await SubscribersService.unsubscribe(token);
        setStatus("success");
        setMessage(
          response?.message || "You have been successfully unsubscribed."
        );
      } catch (error: unknown) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unsubscribe failed. Please try again."
        );
      }
    };

    unsubscribe();
  }, [token]);

  const handleBackToHome = () => {
    router.push("/");
  };

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Unsubscribing...
          </h1>
          <p className="text-gray-600">Processing your request</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unsubscribed
          </h1>
          <p className="text-gray-700 mb-6">{message}</p>
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}
