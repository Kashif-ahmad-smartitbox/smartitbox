"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaArrowRight,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaBloggerB,
  FaPinterestP,
  FaTumblr,
  FaComments,
} from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import SubscribersApi from "@/services/modules/subscribers";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";

// Animation constants
const SPRING_CONFIG = {
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

const FADE_IN_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

interface NavigationLink {
  href: string;
  label: string;
}

interface ContactInfo {
  type: string;
  label: string;
  value: string;
  icon: string;
}

interface FooterData {
  logo: {
    src: string;
    alt: string;
  };
  company: {
    description: string;
    contact: ContactInfo[];
  };
  socialLinks: SocialLink[];
  quickLinks: NavigationLink[];
  services: NavigationLink[];
  legalLinks: NavigationLink[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    submitText: string;
    submittingText: string;
    successMessage: string;
    errorMessages: {
      empty: string;
      invalid: string;
      generic: string;
    };
  };
  copyright: {
    text: string;
    year: number;
  };
}

// =============================================================================
// Icon Mapping & helpers
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaPaperPlane,
    FaArrowRight,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaBloggerB,
    FaPinterestP,
    FaTumblr,
    FaComments,
    SiThreads,
  };
  return iconMap[iconName] || FaEnvelope;
};

interface SocialButtonProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  index: number;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  href,
  label,
  icon: Icon,
  index,
}) => (
  <motion.a
    variants={FADE_IN_VARIANTS}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    whileHover={{
      y: -4,
      scale: 1.1,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgba(59, 130, 246, 0.3)",
    }}
    whileTap={{ scale: 0.95 }}
    transition={{
      delay: index * 0.1,
      type: "spring",
      stiffness: SPRING_CONFIG.stiffness,
      damping: SPRING_CONFIG.damping,
      mass: SPRING_CONFIG.mass,
      duration: 0.3,
    }}
    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
  >
    <Icon className="w-4 h-4" />
  </motion.a>
);

interface FooterColumnProps {
  title: string;
  items: NavigationLink[];
  index: number;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, items, index }) => (
  <motion.div
    variants={FADE_IN_VARIANTS}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    transition={{ delay: index * 0.2 }}
    className="space-y-4"
  >
    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
      <div className="w-1 h-6 bg-linear-to-b from-primary-500 to-primary-600 rounded-full mr-3" />
      {title}
    </h3>
    <ul className="space-y-3">
      {items.map((item, itemIndex) => (
        <motion.li
          key={`${item.href}-${item.label}`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: itemIndex * 0.05 + index * 0.2 }}
        >
          <a
            href={item.href}
            className="text-gray-600 hover:text-primary-600 transition-all duration-300 flex items-center group font-medium text-sm text-nowrap"
          >
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="mr-2 inline-flex"
            >
              <FaArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
            </motion.span>
            {item.label}
          </a>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

interface ContactRowProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: React.ReactNode;
  value: string;
  type: string;
  index: number;
}

const ContactRow: React.FC<ContactRowProps> = ({
  icon: Icon,
  label,
  value,
  type,
  index,
}) => {
  const handleClick = () => {
    switch (type) {
      case "email":
        window.location.href = `mailto:${value}`;
        break;
      case "phone":
        window.location.href = `tel:${value.replace(/\s/g, "")}`;
        break;
      case "address":
        const encodedAddress = encodeURIComponent(value);
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
          "_blank"
        );
        break;
      default:
        break;
    }
  };

  const isClickable = ["email", "phone", "address"].includes(type);

  const content = (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ x: 4 }}
      className="flex items-center group"
    >
      <div
        className={`w-8 h-8 bg-primary-50 border border-primary-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 shrink-0 transition-all duration-300 ${
          isClickable
            ? "group-hover:bg-primary-100 group-hover:border-primary-200 group-hover:shadow-sm cursor-pointer"
            : ""
        }`}
      >
        <Icon
          className={`w-3 h-3 ${
            isClickable
              ? "text-primary-600 group-hover:text-primary-700"
              : "text-primary-600"
          } transition-colors duration-300`}
        />
      </div>
      <p
        className={`text-gray-600 transition-colors duration-300 font-medium text-sm leading-relaxed ${
          isClickable ? "group-hover:text-gray-900 cursor-pointer" : ""
        }`}
      >
        {label}
      </p>
    </motion.div>
  );

  if (!isClickable) {
    return content;
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:rounded-lg"
      aria-label={`${
        type === "email"
          ? "Send email to"
          : type === "phone"
          ? "Call"
          : "Open location for"
      } ${value}`}
    >
      {content}
    </motion.button>
  );
};

interface NewsletterFormProps {
  email: string;
  status: "idle" | "error" | "success";
  message: string;
  isSubmitting: boolean;
  placeholder: string;
  submitText: string;
  submittingText: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  email,
  status,
  message,
  isSubmitting,
  placeholder,
  submitText,
  submittingText,
  onEmailChange,
  onSubmit,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value),
    [onEmailChange]
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-3 w-full lg:w-96"
      noValidate
    >
      <div className="flex-1">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent ${
            status === "error"
              ? "border-primary-400 shadow-sm"
              : "border-gray-200 hover:border-gray-300"
          }`}
          aria-invalid={status === "error"}
          aria-describedby={
            status !== "idle" ? "subscription-message" : undefined
          }
          disabled={isSubmitting}
        />
      </div>
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: SPRING_CONFIG.stiffness,
          damping: SPRING_CONFIG.damping,
          mass: SPRING_CONFIG.mass,
        }}
        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:scale-[1.02] transition-all duration-300 font-semibold shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-35"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <FaPaperPlane className="w-3 h-3" />
        )}
        {isSubmitting ? submittingText : submitText}
      </motion.button>
    </motion.form>
  );
};

const Footer: React.FC<{ data: FooterData }> = ({ data }) => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const handleSubscribe = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("idle");
      setMessage("");
      setIsSubmitting(true);

      if (!email.trim()) {
        setStatus("error");
        setMessage(data.newsletter.errorMessages.empty);
        setIsSubmitting(false);
        return;
      }
      if (!validateEmail(email)) {
        setStatus("error");
        setMessage(data.newsletter.errorMessages.invalid);
        setIsSubmitting(false);
        return;
      }

      const name = deriveNameFromEmail(email);

      try {
        const res = await SubscribersApi.subscribe({
          email,
          name,
          source: "footer",
        });

        if (res.message === "Already subscribed") {
          setStatus("error");
          setMessage("Already subscribed!!");
          return;
        }

        setStatus("success");
        setMessage(data.newsletter.successMessage);
        setEmail("");
      } catch (err: any) {
        console.error("subscribe error:", err);
        setStatus("error");
        setMessage(
          (err && (err.message || err?.response?.message)) ||
            data.newsletter.errorMessages.generic
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, validateEmail, data.newsletter, deriveNameFromEmail]
  );

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (status === "error") {
        setStatus("idle");
        setMessage("");
      }
    },
    [status]
  );

  const formatContactInfo = (contact: ContactInfo) => {
    switch (contact.type) {
      case "address":
        return (
          <>
            <strong className="text-gray-900">{contact.label}:</strong>{" "}
            {contact.value}
          </>
        );
      case "phone":
        return (
          <>
            <strong className="text-gray-900">{contact.label}:</strong>{" "}
            {contact.value}
          </>
        );
      case "email":
        return (
          <>
            <strong className="text-gray-900">{contact.label}:</strong>{" "}
            {contact.value}
          </>
        );
      default:
        return contact.value;
    }
  };

  return (
    <footer className="bg-linear-to-b from-white to-gray-50/30 text-gray-900 relative overflow-hidden border-t border-gray-100">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-16">
          {/* Logo & Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-2 space-y-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Link href="/" className="inline-block">
                <img src={data.logo.src} alt={data.logo.alt} className="h-24" />
              </Link>
            </motion.div>

            <p className="text-gray-600 max-w-md text-base leading-relaxed">
              {data.company.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {data.socialLinks.map((social, index) => {
                const IconComponent = getIconComponent(social.icon);
                return (
                  <SocialButton
                    key={social.id}
                    href={social.href}
                    label={social.label}
                    icon={IconComponent}
                    index={index}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <FooterColumn title="Quick Links" items={data.quickLinks} index={0} />

          {/* Services */}
          <FooterColumn title="Services" items={data.services} index={1} />

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-1 h-6 bg-linear-to-b from-primary-500 to-primary-600 rounded-full mr-3" />
              Get in Touch
            </h3>

            <div className="space-y-4">
              {data.company.contact.map((contact, index) => {
                const IconComponent = getIconComponent(contact.icon);
                return (
                  <ContactRow
                    key={contact.type}
                    icon={IconComponent}
                    label={formatContactInfo(contact)}
                    value={contact.value}
                    type={contact.type}
                    index={index}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mt-20 pt-12 border-t border-gray-200"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {data.newsletter.title}
              </h3>
              <p className="text-gray-600 text-base max-w-md">
                {data.newsletter.description}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
              <NewsletterForm
                email={email}
                status={status}
                message={message}
                isSubmitting={isSubmitting}
                placeholder={data.newsletter.placeholder}
                submitText={data.newsletter.submitText}
                submittingText={data.newsletter.submittingText}
                onEmailChange={handleEmailChange}
                onSubmit={handleSubscribe}
              />

              {message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="subscription-message"
                  className={`w-full text-sm font-medium text-center lg:text-right ${
                    status === "error" ? "text-primary-500" : "text-green-600"
                  }`}
                  role="alert"
                >
                  {message}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-200 bg-gray-50/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-gray-500 text-sm flex items-center flex-wrap gap-2 justify-center md:justify-start"
            >
              {data.copyright.text.replace(
                "{year}",
                data.copyright.year.toString()
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-6 text-sm"
            >
              {data.legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-primary-600 transition-colors duration-200 font-medium hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
