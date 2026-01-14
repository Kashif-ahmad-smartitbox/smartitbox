import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle,
  Mail,
  Clock,
  ArrowLeft,
  Home,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Phone,
} from "lucide-react";

interface ThankYouPageProps {
  data: {
    title?: string;
    message?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    additionalMessage?: string;
    contactEmail?: string;
    nextSteps?: string[];
    estimatedResponseTime?: string;
    showLogo?: boolean;
    autoRedirectSeconds?: number | null;
  };
}

interface StepProps {
  index: number;
  text: string;
}

const Step: React.FC<StepProps> = ({ index, text }) => (
  <li className="flex items-start gap-4 group">
    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-sm font-semibold text-primary-700 border border-primary-100 group-hover:bg-primary-100 group-hover:border-primary-200 transition-colors duration-200">
      {index}
    </div>
    <div className="text-sm text-neutral-700 flex-1">{text}</div>
  </li>
);

const ThankYouPage: React.FC<ThankYouPageProps> = ({ data }) => {
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(5);

  const {
    title = "Message Sent Successfully",
    message = "Thank you for reaching out. We've received your message and our team will get back to you shortly.",
    ctaText = "Back to Contact",
    ctaLink = "/contact",
    secondaryCtaText = "Return Home",
    secondaryCtaLink = "/",
    additionalMessage,
    contactEmail,
    nextSteps = [
      "We'll review your message and respond within our estimated timeframe",
      "Check your email for a confirmation and further instructions",
      "Keep an eye on your inbox for our detailed response",
    ],
    estimatedResponseTime = "24-48",
    showLogo = true,
    autoRedirectSeconds = null,
  } = data;

  //   Handle auto-redirect with countdown display
  useEffect(() => {
    if (autoRedirectSeconds && autoRedirectSeconds > 0) {
      setRedirectCountdown(autoRedirectSeconds);

      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            window.location.href = ctaLink;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [autoRedirectSeconds, ctaLink]);

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 to-primary-50/20 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          {showLogo && (
            <div className="relative w-26 h-12 transition-opacity hover:opacity-90">
              <Image
                src="/logo.svg"
                alt="Company Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Secure Submission</span>
          </div>
        </header>

        {/* Main Content */}
        <main className=" rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100">
            {/* Left Section - Visual Confirmation */}
            <section className="p-8 md:p-12 lg:p-14 flex flex-col items-center justify-center">
              {/* Animated Checkmark */}
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 animate-pulse-subtle">
                  <CheckCircle
                    className="w-10 h-10 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary-200 animate-ping-subtle" />
              </div>

              <h1 className="text-2xl font-bold text-neutral-900 text-center mb-4">
                {title}
              </h1>

              <p className="text-base text-neutral-600 text-center max-w-md mb-8 leading-relaxed">
                {message}
              </p>

              {/* Status Indicators */}
              <div className="w-full max-w-sm mb-10">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-linear-to-b from-green-50 to-white border border-green-100 text-center transition-transform hover:scale-[1.02]">
                    <div className="flex justify-center mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-xs font-medium text-green-700">
                      Message Sent
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-linear-to-b from-blue-50 to-white border border-blue-100 text-center transition-transform hover:scale-[1.02]">
                    <div className="flex justify-center mb-2">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-xs font-medium text-blue-700">
                      Confirmation Sent
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-linear-to-b from-amber-50 to-white border border-amber-100 text-center transition-transform hover:scale-[1.02]">
                    <div className="flex justify-center mb-2">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="text-xs font-medium text-amber-700">
                      {estimatedResponseTime} Hours
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full max-w-sm space-y-4">
                <a
                  href={ctaLink}
                  className="group flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-linear-to-r from-primary-700 to-primary-600 text-white font-semibold hover:from-primary-800 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  {ctaText}
                  {redirectCountdown !== null && (
                    <span className="text-sm font-normal opacity-90">
                      ({redirectCountdown}s)
                    </span>
                  )}
                </a>

                <a
                  href={secondaryCtaLink}
                  className="group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  {secondaryCtaText}
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </section>

            {/* Right Section - Next Steps */}
            <aside className="p-8 md:p-12 lg:p-14 bg-linear-to-b from-white to-neutral-50/50">
              <div className="mb-8 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-neutral-900">
                  What happens next?
                </h2>
              </div>

              <ol className="space-y-6 mb-8">
                {nextSteps.map((step, index) => (
                  <Step key={`step-${index}`} index={index + 1} text={step} />
                ))}
              </ol>

              {/* Additional Information Cards */}
              <div className="space-y-4">
                {additionalMessage && (
                  <div className="p-5 rounded-xl bg-linear-to-r from-primary-50 to-primary-50/50 border border-primary-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-primary-700" />
                      </div>
                      <p className="text-sm text-primary-800">
                        {additionalMessage}
                      </p>
                    </div>
                  </div>
                )}

                {contactEmail && (
                  <div className="p-5 rounded-xl border border-neutral-200 bg-white transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5 text-neutral-600" />
                      <div className="text-sm font-medium text-neutral-900">
                        Need immediate assistance?
                      </div>
                    </div>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex items-center gap-2 text-base font-medium text-primary-700 hover:text-primary-800 transition-colors group"
                    >
                      {contactEmail}
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                )}

                {/* Support Info */}
                <div className="p-5 rounded-xl bg-linear-to-r from-amber-50 to-amber-50/30 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <div className="text-sm font-medium text-amber-900">
                      Urgent Support Available
                    </div>
                  </div>
                  <p className="text-sm text-amber-800">
                    For urgent matters requiring immediate attention, please
                    mail our support line.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Your information is secure and encrypted</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-neutral-300" />
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Confirmation sent • Check spam if not received</span>
            </div>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes ping-subtle {
          75%,
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        .animate-ping-subtle {
          animation: ping-subtle 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;
