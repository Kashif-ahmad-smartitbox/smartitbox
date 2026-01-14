"use client";
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Loader,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  User,
  Building,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Target,
} from "lucide-react";
import { ContactApi, SubmitFormPayload } from "@/services/modules/contact";
import { useSearchParams } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactSectionProps {
  data: {
    header?: {
      subtitle?: string;
      title?: string;
      description?: string;
    };
    contactInfo?: {
      title?: string;
      items?: Array<{
        label?: string;
        value?: string;
        description?: string;
        href?: string;
      }>;
    };
    form?: {
      labels?: {
        name?: string;
        email?: string;
        company?: string;
        subject?: string;
        message?: string;
      };
      placeholders?: {
        name?: string;
        email?: string;
        company?: string;
        message?: string;
      };
      subjectOptions?: string[];
      validation?: {
        requiredFields?: string;
        errors?: {
          name?: string;
          email?: {
            required?: string;
            invalid?: string;
          };
          subject?: string;
          message?: {
            required?: string;
            minLength?: string;
          };
        };
      };
      buttons?: {
        submit?: string;
        submitting?: string;
        anotherMessage?: string;
      };
    };
    success?: {
      title?: string;
      description?: string;
    };
    errors?: {
      submission?: string;
      default?: string;
    };
  };
}

const defaultData = {
  header: {
    subtitle: "Get In Touch",
    title: "Let's Start a Conversation",
    description:
      "Have a project in mind or want to learn more about our services? We'd love to hear from you and discuss how we can help.",
  },
  contactInfo: {
    title: "Contact Information",
    items: [
      {
        label: "Email us",
        value: "hello@company.com",
        description: "We'll respond within 24 hours",
        href: "mailto:hello@company.com",
      },
      {
        label: "Call us",
        value: "+1 (555) 123-4567",
        description: "Mon-Fri from 9am to 5pm",
        href: "tel:+15551234567",
      },
      {
        label: "Visit us",
        value: "123 Business Ave",
        description: "San Francisco, CA 94107",
        href: "https://maps.google.com",
      },
      {
        label: "Office hours",
        value: "Monday - Friday",
        description: "9:00 AM - 6:00 PM PST",
      },
    ],
  },
  form: {
    labels: {
      name: "Full Name *",
      email: "Email Address *",
      company: "Company",
      subject: "Subject *",
      message: "Message *",
    },
    placeholders: {
      name: "Enter your full name",
      email: "Enter your email",
      company: "Your company name",
      message: "Tell us about your project or inquiry...",
    },
    subjectOptions: [
      "General Inquiry",
      "Partnership",
      "Support",
      "Sales",
      "Feedback",
      "Other",
    ],
    validation: {
      requiredFields: "* Required fields",
      errors: {
        name: "Name is required",
        email: {
          required: "Email is required",
          invalid: "Please enter a valid email address",
        },
        subject: "Subject is required",
        message: {
          required: "Message is required",
          minLength: "Message must be at least 10 characters",
        },
      },
    },
    buttons: {
      submit: "Send Message",
      submitting: "Sending...",
      anotherMessage: "Send Another Message",
    },
  },
  success: {
    title: "Message Sent Successfully!",
    description:
      "Thank you for reaching out. We've received your message and will get back to you within 24 hours.",
  },
  errors: {
    submission: "Submission Error",
    default: "Failed to send message. Please try again later.",
  },
};

// Helper function to safely access nested properties
const getSafeValue = <T,>(value: T | undefined, defaultValue: T): T => {
  return value ?? defaultValue;
};

export default function ContactSection({ data }: ContactSectionProps) {
  // Safely merge data with defaults
  const content = {
    header: { ...defaultData.header, ...data?.header },
    contactInfo: {
      title: getSafeValue(
        data?.contactInfo?.title,
        defaultData.contactInfo.title
      ),
      items: data?.contactInfo?.items ?? defaultData.contactInfo.items,
    },
    form: {
      labels: { ...defaultData.form.labels, ...data?.form?.labels },
      placeholders: {
        ...defaultData.form.placeholders,
        ...data?.form?.placeholders,
      },
      subjectOptions:
        data?.form?.subjectOptions ?? defaultData.form.subjectOptions,
      validation: {
        requiredFields: getSafeValue(
          data?.form?.validation?.requiredFields,
          defaultData.form.validation.requiredFields
        ),
        errors: {
          name: getSafeValue(
            data?.form?.validation?.errors?.name,
            defaultData.form.validation.errors.name
          ),
          email: {
            required: getSafeValue(
              data?.form?.validation?.errors?.email?.required,
              defaultData.form.validation.errors.email.required
            ),
            invalid: getSafeValue(
              data?.form?.validation?.errors?.email?.invalid,
              defaultData.form.validation.errors.email.invalid
            ),
          },
          subject: getSafeValue(
            data?.form?.validation?.errors?.subject,
            defaultData.form.validation.errors.subject
          ),
          message: {
            required: getSafeValue(
              data?.form?.validation?.errors?.message?.required,
              defaultData.form.validation.errors.message.required
            ),
            minLength: getSafeValue(
              data?.form?.validation?.errors?.message?.minLength,
              defaultData.form.validation.errors.message.minLength
            ),
          },
        },
      },
      buttons: { ...defaultData.form.buttons, ...data?.form?.buttons },
    },
    success: { ...defaultData.success, ...data?.success },
    errors: { ...defaultData.errors, ...data?.errors },
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const searchParams = useSearchParams();
  const urlRef = searchParams.get("ref") || "";

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = content.form.validation.errors.name;
    }

    if (!formData.email.trim()) {
      newErrors.email = content.form.validation.errors.email.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = content.form.validation.errors.email.invalid;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = content.form.validation.errors.subject;
    }

    if (!formData.message.trim()) {
      newErrors.message = content.form.validation.errors.message.required;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = content.form.validation.errors.message.minLength;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: SubmitFormPayload = {
        formName: "contact",
        data: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          subject: formData.subject,
          message: formData.message,
        },
        email: formData.email,
        name: formData.name,
        urlRef: urlRef ? urlRef : "https://www.smartitbox.in/contact",
        honeypot: null,
      };

      await ContactApi.submitForm(payload);

      window.location.href = "/thankyou";
    } catch (error: any) {
      console.error("Failed to submit form:", error);

      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.message) {
        setSubmitError(error.message);
      } else {
        setSubmitError(content.errors.default);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Icon mapping for contact info items
  const iconMap = {
    "Email us": Mail,
    "Call us": Phone,
    "Visit us": MapPin,
    "Office hours": Clock,
  };

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden bg-linear-to-br from-white via-primary-50/20 to-primary-100/10"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header with animation */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Enhanced Contact Information - Glassmorphism Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl shadow-primary-100/30 hover:shadow-2xl hover:shadow-primary-200/40 transition-all duration-500 group">
                <div className="relative mb-10">
                  <div className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-linear-to-br from-primary-500 to-blue-500 opacity-10 blur-lg" />
                  <div className="flex items-center gap-4 relative">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {content.contactInfo.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Get in touch through your preferred channel
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {content.contactInfo.items.map((item, index) => {
                    const IconComponent =
                      iconMap[item.label as keyof typeof iconMap] ||
                      MessageCircle;
                    return (
                      <div
                        key={index}
                        className="relative group/card p-6 rounded-2xl bg-linear-to-br from-white to-white/80 border border-gray-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-100/30 transition-all duration-300 cursor-pointer overflow-hidden"
                        onClick={() =>
                          item.href && window.open(item.href, "_blank")
                        }
                      >
                        {/* Hover effect background */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary-50/0 to-blue-50/0 group-hover/card:from-primary-50/50 group-hover/card:to-blue-50/30 transition-all duration-500" />

                        <div className="relative flex items-start gap-5">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-sm group-hover/card:shadow-md transition-shadow duration-300">
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-linear-to-br from-primary-400/20 to-blue-400/20 rounded-xl blur-md opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold text-gray-900 mb-1 tracking-wide">
                              {item.label}
                            </p>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors mt-1 group/link"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.value}
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity transform group-hover/link:translate-x-1" />
                              </a>
                            ) : (
                              <p className="text-sm font-semibold text-primary-700 mt-1">
                                {item.value}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Animated indicator */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                          <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form - Modern Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border border-white/50 shadow-2xl shadow-primary-100/20 hover:shadow-primary-200/30 transition-all duration-500">
              {/* Error Message with improved design */}
              {submitError && (
                <div className="mb-10 p-6 rounded-2xl bg-linear-to-r from-red-50/80 to-red-50/50 border border-red-200/80 backdrop-blur-sm flex items-start gap-5 animate-fade-in">
                  <div className="relative">
                    <AlertCircle className="w-7 h-7 text-red-500 shrink-0" />
                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-900 font-bold text-lg">
                      {content.errors.submission}
                    </p>
                    <p className="text-red-700 mt-2">{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div className="group relative">
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {content.form.labels.name}
                      </div>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      className={`w-full px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                        errors.name
                          ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-gray-200 hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                      } outline-none bg-white/80 backdrop-blur-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder={content.form.placeholders.name}
                      disabled={isSubmitting}
                    />
                    {errors.name && touched.name && (
                      <p className="mt-3 text-sm font-medium text-red-600 animate-fade-in flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="group relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {content.form.labels.email}
                      </div>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      className={`w-full px-6 py-3 rounded-xl border-2 transition-all duration-300 ${
                        errors.email
                          ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-gray-200 hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                      } outline-none bg-white/80 backdrop-blur-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                      placeholder={content.form.placeholders.email}
                      disabled={isSubmitting}
                    />
                    {errors.email && touched.email && (
                      <p className="mt-3 text-sm font-medium text-red-600 animate-fade-in flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company & Subject Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Field */}
                  <div className="group relative">
                    <label
                      htmlFor="company"
                      className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {content.form.labels.company}
                      </div>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={content.form.placeholders.company}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Enhanced Subject Dropdown */}
                  <div className="group relative">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {content.form.labels.subject}
                      </div>
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={() => handleBlur("subject")}
                        className={`w-full px-6 py-3 pr-12 rounded-xl border-2 appearance-none transition-all duration-300 ${
                          errors.subject
                            ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                            : "border-gray-200 hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                        } outline-none bg-white/80 backdrop-blur-sm shadow-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`}
                        disabled={isSubmitting}
                      >
                        <option value="" className="text-gray-400">
                          Select a subject
                        </option>
                        {content.form.subjectOptions.map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="text-gray-900 py-2"
                          >
                            {option}
                          </option>
                        ))}
                      </select>

                      {/* Custom dropdown icon */}
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown
                          className={`w-5 h-5 transition-all duration-300 ${
                            formData.subject
                              ? "text-primary-500"
                              : "text-gray-400 group-hover:text-primary-400"
                          } ${isSubmitting ? "animate-pulse" : ""}`}
                        />
                      </div>
                    </div>
                    {errors.subject && touched.subject && (
                      <p className="mt-3 text-sm font-medium text-red-600 animate-fade-in flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced Message Textarea */}
                <div className="group relative">
                  <div className="flex items-center justify-between mb-4">
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {content.form.labels.message}
                      </div>
                    </label>
                    <div className="text-sm font-medium text-gray-500">
                      <span
                        className={
                          formData.message.length >= 10
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      >
                        {formData.message.length}
                      </span>
                      /10 min
                    </div>
                  </div>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur("message")}
                    rows={6}
                    className={`w-full px-6 py-4.5 rounded-xl border-2 transition-all duration-300 ${
                      errors.message
                        ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                    } outline-none bg-white/80 backdrop-blur-sm shadow-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder={content.form.placeholders.message}
                    disabled={isSubmitting}
                  />

                  {/* Character count indicator */}
                  <div className="absolute bottom-4 right-6 flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        formData.message.length >= 10
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors duration-300 ${
                        formData.message.length >= 10
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.message.length >= 10
                        ? "✓ Ready to send"
                        : "Minimum 10 characters"}
                    </span>
                  </div>

                  {errors.message && touched.message && (
                    <p className="mt-3 text-sm font-medium text-red-600 animate-fade-in flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Enhanced Submit Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-10 border-t border-gray-200/70 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {content.form.validation.requiredFields}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative inline-flex items-center gap-4 px-8 py-4 rounded bg-primary-600 to-blue-600 text-white font-bold text-sm hover:from-primary-600 hover:via-primary-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-primary-500/30 transform hover:scale-105 disabled:transform-none group overflow-hidden min-w-[220px] justify-center"
                  >
                    {/* Content */}
                    <div className="relative flex items-center gap-3">
                      {isSubmitting ? (
                        <>
                          <Loader className="w-6 h-6 animate-spin" />
                          {content.form.buttons.submitting}
                        </>
                      ) : (
                        <>
                          {content.form.buttons.submit}
                          <Send className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
