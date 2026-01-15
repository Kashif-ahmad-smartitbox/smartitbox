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
import { motion } from "framer-motion";

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
  const content = {
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
      className="relative py-5 lg:py-20 overflow-hidden bg-white"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="p-6 bg-linear-to-r from-primary-50 to-primary-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-1 h-6 bg-linear-to-b from-primary-500 to-primary-600 rounded-full" />
                    {content.contactInfo.title}
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  {content.contactInfo.items.map((item, index) => {
                    const IconComponent =
                      iconMap[item.label as keyof typeof iconMap] ||
                      MessageCircle;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 group p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer"
                        onClick={() =>
                          item.href && window.open(item.href, "_blank")
                        }
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-primary-100 transition-colors">
                          <IconComponent className="w-4 h-4 text-primary-600" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm text-primary-600 hover:text-primary-700 transition-colors font-medium mt-1 flex items-center gap-1 group/link"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.value}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                          ) : (
                            <p className="text-sm text-gray-700 font-medium mt-1">
                              {item.value}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              {/* Error Message */}
              {submitError && (
                <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-semibold">
                      {content.errors.submission}
                    </p>
                    <p className="text-red-600 text-sm mt-1">{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
                {/* Personal Information Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      {content.form.labels.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur("name")}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                        errors.name
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      } outline-none`}
                      placeholder={content.form.placeholders.name}
                      disabled={isSubmitting}
                    />
                    {errors.name && touched.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      {content.form.labels.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                        errors.email
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      } outline-none`}
                      placeholder={content.form.placeholders.email}
                      disabled={isSubmitting}
                    />
                    {errors.email && touched.email && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company & Subject Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Company Field */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      {content.form.labels.company}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-300"
                      placeholder={content.form.placeholders.company}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Subject Dropdown */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      {content.form.labels.subject}
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={() => handleBlur("subject")}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                        errors.subject
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      } outline-none`}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a subject</option>
                      {content.form.subjectOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.subject && touched.subject && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-900"
                    >
                      {content.form.labels.message}
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.message.length}/10 min
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={() => handleBlur("message")}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                      errors.message
                        ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    } outline-none resize-none`}
                    placeholder={content.form.placeholders.message}
                    disabled={isSubmitting}
                  />
                  {errors.message && touched.message && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-200 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-primary-600" />
                    </div>
                    <p className="text-sm text-gray-600">
                      {content.form.validation.requiredFields}
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        {content.form.buttons.submitting}
                      </>
                    ) : (
                      <>
                        {content.form.buttons.submit}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
