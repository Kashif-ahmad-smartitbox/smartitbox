import React from "react";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ButtonProps {
  // Content
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;

  // Variants
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";

  // Icon
  icon?: LucideIcon;
  iconPosition?: "left" | "right";

  // States
  disabled?: boolean;
  loading?: boolean;

  // Additional
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  // Base styles
  const baseStyles =
    "group relative inline-flex items-center justify-center font-semibold transition-all duration-300 overflow-hidden rounded-xl border";

  // Size variants
  const sizeStyles = {
    sm: "px-4 py-2.5 text-sm gap-2",
    md: "px-6 py-3 text-sm gap-3",
    lg: "px-8 py-4 text-base gap-3",
  };

  // Color variants - Improved with better defaults
  const variantStyles = {
    primary:
      "bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-600 shadow-lg hover:shadow-xl hover:scale-105",
    secondary:
      "bg-gradient-to-br from-secondary-500 to-secondary-600 text-white border-secondary-600 shadow-lg hover:shadow-xl hover:scale-105",
    outline:
      "bg-transparent text-gray-900 border-gray-300 hover:border-primary-400 hover:shadow-lg hover:bg-gray-50",
    ghost:
      "bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900",
  };

  // Disabled state
  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-lg";

  // Width
  const widthStyles = fullWidth ? "w-full" : "";

  // Interactive effects for primary and secondary variants
  const interactiveEffects =
    (variant === "primary" || variant === "secondary") &&
    !disabled &&
    !loading ? (
      <>
        {/* Hover background */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${
            variant === "primary"
              ? "from-primary-600 to-primary-500"
              : "from-secondary-600 to-secondary-500"
          } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Shine effect */}
        <div
          className="absolute inset-0 -left-full group-hover:left-full w-full bg-linear
        -to-r from-transparent via-white/20 to-transparent transition-left duration-700"
        />
      </>
    ) : null;

  // Loading spinner
  const loadingSpinner = loading && (
    <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Icon component with improved sizing
  const iconComponent = Icon && !loading && (
    <Icon
      size={size === "sm" ? 16 : size === "md" ? 18 : 20}
      className={`transition-transform duration-300 ${
        iconPosition === "right"
          ? "group-hover:translate-x-1"
          : "group-hover:-translate-x-1"
      } ${
        variant === "outline" || variant === "ghost"
          ? "text-current"
          : "text-white"
      }`}
    />
  );

  // Content with icon
  const content = (
    <>
      {loadingSpinner}
      <div
        className={`relative z-10 flex items-center gap-3 ${
          loading ? "opacity-0" : "opacity-100"
        } ${size === "sm" ? "gap-2" : "gap-3"}`}
      >
        {iconPosition === "left" && iconComponent}
        <span className="whitespace-nowrap">{children}</span>
        {iconPosition === "right" && iconComponent}
      </div>
      {interactiveEffects}
    </>
  );

  // Combined styles
  const combinedStyles = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? disabledStyles : ""}
    ${widthStyles}
    ${className}
  `.trim();

  // Render as link or button
  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={combinedStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedStyles}
    >
      {content}
    </button>
  );
}

// Pre-configured button variants for common use cases
export function PrimaryButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="primary" {...props} />;
}

export function SecondaryButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="secondary" {...props} />;
}

export function OutlineButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="outline" {...props} />;
}

export function GhostButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="ghost" {...props} />;
}

// CTA Button with arrow (commonly used in your components)
interface CTAButtonProps
  extends Omit<ButtonProps, "icon" | "iconPosition" | "variant"> {
  variant?: "primary" | "secondary";
}

export function CTAButton({ variant = "primary", ...props }: CTAButtonProps) {
  return (
    <Button
      variant={variant}
      icon={ArrowRight}
      iconPosition="right"
      {...props}
    />
  );
}

// Specialized button variants for common use cases
export function SuccessButton(props: Omit<ButtonProps, "variant">) {
  return (
    <Button
      variant="primary"
      className="bg-linear-to-br from-green-500 to-green-600 border-green-600 hover:from-green-600 hover:to-green-500"
      {...props}
    />
  );
}

export function DangerButton(props: Omit<ButtonProps, "variant">) {
  return (
    <Button
      variant="primary"
      className="bg-linear-to-br from-red-500 to-red-600 border-red-600 hover:from-red-600 hover:to-red-500"
      {...props}
    />
  );
}

export function WarningButton(props: Omit<ButtonProps, "variant">) {
  return (
    <Button
      variant="primary"
      className="bg-linear-to-br from-yellow-500 to-yellow-600 border-yellow-600 hover:from-yellow-600 hover:to-yellow-500"
      {...props}
    />
  );
}

// Social media buttons
export function GitHubButton(props: Omit<ButtonProps, "variant">) {
  return (
    <OutlineButton
      icon={props.icon}
      className="border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
      {...props}
    />
  );
}

export function TwitterButton(props: Omit<ButtonProps, "variant">) {
  return (
    <OutlineButton
      icon={props.icon}
      className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
      {...props}
    />
  );
}

// Icon-only button variant
interface IconButtonProps extends Omit<ButtonProps, "children"> {
  "aria-label": string;
  icon: LucideIcon;
}

export function IconButton({
  icon: Icon,
  "aria-label": ariaLabel,
  size = "md",
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  return (
    <Button
      size={size}
      {...props}
      className={`${sizeStyles[size]} aspect-square p-0! ${
        props.className || ""
      }`}
    >
      <Icon
        size={size === "sm" ? 16 : size === "md" ? 20 : 24}
        className="shrink-0"
      />
    </Button>
  );
}
