"use client";

import React from "react";

interface DynamicHTMLSectionProps {
  data: {
    title?: string;
    subtitle?: string;
    content: string; // HTML string
    variant?: "default" | "card" | "minimal" | "elegant";
    maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
    backgroundColor?: "white" | "gray" | "primary" | "dark";
    showTableOfContents?: boolean;
    lastUpdated?: string;
  };
}

const maxWidthClasses = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

const backgroundColorClasses = {
  white: "bg-white",
  gray: "bg-gray-50",
  primary: "bg-primary-50",
  dark: "bg-gradient-to-br from-gray-900 to-gray-800",
};

export default function DynamicHTMLSection({ data }: DynamicHTMLSectionProps) {
  const {
    title,
    subtitle,
    content,
    variant = "default",
    maxWidth = "lg",
    backgroundColor = "white",
    showTableOfContents = false,
    lastUpdated,
  } = data || {}; // Add fallback for data

  // Safe content handling
  const safeContent = content || "";

  // Extract headings for table of contents
  const extractHeadings = (html: string) => {
    if (!showTableOfContents || !html) return [];

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

      return Array.from(headings).map((heading, index) => ({
        id: `section-${index}`,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1)),
      }));
    } catch (error) {
      console.error("Error extracting headings:", error);
      return [];
    }
  };

  const headings = React.useMemo(
    () => extractHeadings(safeContent),
    [safeContent, showTableOfContents]
  );

  // Process HTML content safely
  const processedContent = React.useMemo(() => {
    if (!safeContent) return "";

    try {
      return safeContent.replace(
        /<h([1-6])>/g,
        (match, level) =>
          `<h${level} id="section-${Math.random()
            .toString(36)
            .substr(2, 9)}" class="scroll-mt-20">`
      );
    } catch (error) {
      console.error("Error processing HTML content:", error);
      return safeContent; // Return original content if processing fails
    }
  }, [safeContent]);

  const TableOfContents = () => {
    if (!showTableOfContents || headings.length === 0) return null;

    const isDark = backgroundColor === "dark";

    return (
      <nav
        className={`mb-8 p-6 rounded-2xl border transition-all duration-300 ${
          isDark
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white border-primary-100"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-2 h-2 rounded-full ${
              isDark ? "bg-primary-400" : "bg-primary-500"
            }`}
          />
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-primary-900"
            }`}
          >
            Table of Contents
          </h3>
        </div>
        <ul className="space-y-3">
          {headings.map((heading, index) => (
            <li
              key={heading.id}
              className={`ml-${
                (heading.level - 2) * 4
              } transition-all duration-200 hover:translate-x-1`}
            >
              <a
                href={`#${heading.id}`}
                className={`text-sm font-medium transition-colors duration-200 hover:underline ${
                  isDark
                    ? "text-primary-200 hover:text-primary-100"
                    : "text-primary-700 hover:text-primary-800"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const containerClasses = {
    default: "py-16 lg:py-20",
    card: "py-16 lg:py-20",
    minimal: "py-12 lg:py-16",
    elegant: "py-20 lg:py-24",
  };

  const contentClasses = {
    default: `prose prose-lg max-w-none 
              prose-headings:font-bold prose-headings:leading-tight
              prose-headings:text-primary-900
              prose-h1:text-4xl prose-h1:lg:text-5xl
              prose-h2:text-3xl prose-h2:lg:text-4xl
              prose-h3:text-2xl prose-h3:lg:text-3xl
              prose-p:text-primary-700 prose-p:leading-relaxed prose-p:text-lg
              prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline 
              hover:prose-a:text-primary-700 hover:prose-a:underline
              prose-strong:text-primary-900 prose-strong:font-bold
              prose-ul:text-primary-700 prose-ol:text-primary-700
              prose-li:leading-relaxed prose-li:text-lg
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
              prose-blockquote:bg-primary-50 prose-blockquote:py-4 prose-blockquote:px-6
              prose-blockquote:text-primary-800 prose-blockquote:italic prose-blockquote:rounded-r-xl
              prose-blockquote:font-medium
              prose-table:border-primary-200 prose-table:rounded-xl
              prose-table:overflow-hidden
              prose-th:bg-primary-50 prose-th:text-primary-900 prose-th:font-bold
              prose-th:border-primary-200 prose-th:py-4 prose-th:px-6
              prose-td:text-primary-700 prose-td:border-t prose-td:border-primary-100
              prose-td:py-3 prose-td:px-6
              prose-hr:border-primary-200 prose-hr:my-8
              prose-code:text-primary-800 prose-code:bg-primary-100 
              prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-medium
              prose-pre:bg-primary-900 prose-pre:text-primary-100
              focus:outline-none`,

    card: `prose prose-lg max-w-none 
           bg-white rounded-2xl border border-primary-100 p-8 lg:p-10
           prose-headings:font-bold prose-headings:leading-tight
           prose-headings:text-primary-900
           prose-h1:text-4xl prose-h1:lg:text-5xl
           prose-h2:text-3xl prose-h2:lg:text-4xl
           prose-h3:text-2xl prose-h3:lg:text-3xl
           prose-p:text-primary-700 prose-p:leading-relaxed prose-p:text-lg
           prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline 
           hover:prose-a:text-primary-700 hover:prose-a:underline
           prose-strong:text-primary-900 prose-strong:font-bold
           prose-ul:text-primary-700 prose-ol:text-primary-700
           prose-li:leading-relaxed prose-li:text-lg
           prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
           prose-blockquote:bg-primary-50 prose-blockquote:py-4 prose-blockquote:px-6
           prose-blockquote:text-primary-800 prose-blockquote:italic prose-blockquote:rounded-r-xl
           prose-blockquote:font-medium
           prose-table:border-primary-200 prose-table:rounded-xl
           prose-table:overflow-hidden
           prose-th:bg-primary-50 prose-th:text-primary-900 prose-th:font-bold
           prose-th:border-primary-200 prose-th:py-4 prose-th:px-6
           prose-td:text-primary-700 prose-td:border-t prose-td:border-primary-100
           prose-td:py-3 prose-td:px-6
           prose-hr:border-primary-200 prose-hr:my-8
           prose-code:text-primary-800 prose-code:bg-primary-100 
           prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-medium
           prose-pre:bg-primary-900 prose-pre:text-primary-100
           prose-pre:rounded-xl
           prose-img:rounded-xl
           focus:outline-none`,

    minimal: `prose prose-base max-w-none
              prose-headings:font-semibold prose-headings:text-primary-900
              prose-p:text-primary-600 prose-p:leading-relaxed
              prose-a:text-primary-500 prose-a:font-medium prose-a:no-underline 
              hover:prose-a:text-primary-600 hover:prose-a:underline
              prose-strong:text-primary-800 prose-strong:font-semibold
              prose-ul:text-primary-600 prose-ol:text-primary-600
              prose-li:leading-relaxed
              prose-blockquote:border-l-2 prose-blockquote:border-primary-300 
              prose-blockquote:text-primary-600 prose-blockquote:pl-4
              prose-table:border-primary-100
              prose-th:bg-primary-50 prose-th:text-primary-800
              prose-td:text-primary-600 prose-td:border-t prose-td:border-primary-50
              prose-hr:border-primary-100
              prose-code:bg-primary-100 prose-code:text-primary-700
              prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
              prose-pre:bg-primary-50 prose-pre:text-primary-700
              prose-pre:rounded-lg
              prose-img:rounded-lg`,

    elegant: `prose prose-xl max-w-none 
              prose-headings:font-bold prose-headings:leading-tight
              prose-headings:text-primary-900
              prose-h1:text-5xl prose-h1:lg:text-6xl prose-h1:bg-gradient-to-r prose-h1:from-primary-600 prose-h1:to-primary-800 prose-h1:bg-clip-text prose-h1:text-transparent
              prose-h2:text-4xl prose-h2:lg:text-5xl
              prose-h3:text-3xl prose-h3:lg:text-4xl
              prose-p:text-primary-700 prose-p:leading-relaxed prose-p:text-xl
              prose-p:font-light
              prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline 
              hover:prose-a:text-primary-700 hover:prose-a:underline
              prose-strong:text-primary-900 prose-strong:font-bold
              prose-ul:text-primary-700 prose-ol:text-primary-700
              prose-li:leading-relaxed prose-li:text-xl prose-li:font-light
              prose-blockquote:border-l-4 prose-blockquote:border-primary-500 
              prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary-50 prose-blockquote:to-primary-100
              prose-blockquote:py-6 prose-blockquote:px-8
              prose-blockquote:text-primary-800 prose-blockquote:italic prose-blockquote:rounded-r-2xl
              prose-blockquote:font-light prose-blockquote:text-lg
              prose-table:border-primary-200 prose-table:rounded-2xl
              prose-table:overflow-hidden
              prose-th:bg-gradient-to-r prose-th:from-primary-500 prose-th:to-primary-600 
              prose-th:text-white prose-th:font-bold prose-th:py-5 prose-th:px-6
              prose-td:text-primary-700 prose-td:border-t prose-td:border-primary-100
              prose-td:py-4 prose-td:px-6 prose-td:font-light
              prose-hr:border-primary-300 prose-hr:my-10
              prose-code:text-primary-800 prose-code:bg-primary-100 
              prose-code:px-3 prose-code:py-1.5 prose-code:rounded-xl prose-code:font-medium
              prose-code:text-lg
              prose-pre:bg-gradient-to-br prose-pre:from-primary-900 prose-pre:to-primary-800 
              prose-pre:text-primary-100 prose-pre:rounded-2xl
              prose-pre:border prose-pre:border-primary-700
              prose-img:rounded-2xl prose-img:border prose-img:border-primary-100
              focus:outline-none`,
  };

  const isDark = backgroundColor === "dark";

  // If no content is provided, show a fallback message
  if (!safeContent) {
    return (
      <section
        className={`py-16 lg:py-20 ${backgroundColorClasses[backgroundColor]}`}
      >
        <div
          className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]}`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">
              Content Not Available
            </h2>
            <p className="text-primary-600">
              No content has been provided for this section.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${containerClasses[variant]} ${backgroundColorClasses[backgroundColor]} relative overflow-hidden`}
    >
      {/* Background decoration for elegant variant */}
      {variant === "elegant" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>
      )}

      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${maxWidthClasses[maxWidth]}`}
      >
        {/* Table of Contents */}
        <TableOfContents />

        {/* Dynamic HTML Content */}
        <div
          className={`${contentClasses[variant]} ${
            isDark ? "prose-invert" : ""
          }`}
          dangerouslySetInnerHTML={{
            __html: processedContent,
          }}
        />

        {/* Last Updated Footer */}
        {(lastUpdated || variant !== "minimal") && (
          <div
            className={`mt-12 pt-8 border-t ${
              isDark ? "border-white/20" : "border-primary-200"
            }`}
          >
            <p
              className={`text-sm text-center ${
                isDark ? "text-primary-300" : "text-primary-600"
              }`}
            >
              {lastUpdated
                ? `Last updated: ${lastUpdated}`
                : `Last updated: ${new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}`}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
