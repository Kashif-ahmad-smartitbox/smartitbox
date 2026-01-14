import { BookOpen } from "lucide-react";
import { useCallback, useState } from "react";
import SubscribersApi from "@/services/modules/subscribers";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = useCallback((value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }, []);

  const deriveNameFromEmail = useCallback((emailAddr: string) => {
    const local = String(emailAddr || "").split("@")[0];
    const cleaned = local
      .replace(/[._-]+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    return cleaned || emailAddr;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      setStatus("idle");
      setMessage("");
      setIsSubmitting(true);

      // Validation
      if (!email.trim()) {
        setStatus("error");
        setMessage("Email is required");
        setIsSubmitting(false);
        return;
      }

      if (!validateEmail(email)) {
        setStatus("error");
        setMessage("Please enter a valid email address");
        setIsSubmitting(false);
        return;
      }

      const name = deriveNameFromEmail(email);

      try {
        const res = await SubscribersApi.subscribe({
          email,
          name,
          source: "newsletter-component", // Different source to track where subscription came from
        });

        if (res.message === "Already subscribed") {
          setStatus("error");
          setMessage("You're already subscribed to our newsletter!");
          return;
        }

        setStatus("success");
        setMessage(
          "Successfully subscribed! Thank you for joining our newsletter."
        );

        // Reset form after successful submission
        setTimeout(() => {
          setEmail("");
          setStatus("idle");
          setMessage("");
        }, 3000);
      } catch (err: any) {
        console.error("Newsletter subscription error:", err);
        setStatus("error");
        setMessage(
          err?.message ||
            err?.response?.message ||
            "Subscription failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, validateEmail, deriveNameFromEmail]
  );

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      // Clear error state when user starts typing
      if (status === "error") {
        setStatus("idle");
        setMessage("");
      }
    },
    [status]
  );

  return (
    <div className="bg-gradient-to-br from-primary-50 to-pink-50 rounded-2xl p-5 sm:p-6 border border-primary-100">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-primary-600 flex-shrink-0" />
        <h3 className="font-bold text-gray-900">Newsletter</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Get product updates and practical playbooks — once a month, no spam.
      </p>

      {status === "success" ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm font-semibold text-green-700">
            ✓ {message || "Successfully subscribed!"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`flex-1 px-3 sm:px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary-200 min-w-0 transition-colors ${
                status === "error"
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-primary-500"
              }`}
              disabled={isSubmitting}
              aria-invalid={status === "error"}
              aria-describedby={message ? "newsletter-message" : undefined}
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 sm:px-5 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg flex-shrink-0 flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {message && (
            <div
              id="newsletter-message"
              className={`text-xs font-medium ${
                status === "error" ? "text-red-600" : "text-gray-600"
              }`}
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Newsletter;
