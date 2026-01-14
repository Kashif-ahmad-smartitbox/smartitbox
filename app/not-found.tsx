"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 Number */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-9xl font-bold text-gray-900 tracking-tighter">
              404
            </span>
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Page not found
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The
              page might have been moved, deleted, or you entered an incorrect
              URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-3">
              Or try searching for what you need:
            </p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Search className="w-4 h-4" />
              <span className="font-medium">Browse Articles</span>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-gray-400 text-sm">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-gray-600 hover:text-gray-900 underline"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
