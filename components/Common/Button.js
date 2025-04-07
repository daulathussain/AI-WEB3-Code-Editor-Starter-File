"use client";

import React from "react";

/**
 * Button component with different variants (primary, secondary, danger)
 *
 * @param {Object} props
 * @param {string} [props.variant='default'] - Button style variant (default, primary, secondary, danger)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 */
const Button = ({
  variant = "default",
  size = "md",
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  className = "",
  type = "button",
  ...props
}) => {
  // Base classes
  const baseClasses =
    "rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1e1e2e] flex items-center justify-center";

  // Size classes
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  // Variant classes
  const variantClasses = {
    default: "bg-[#464866] hover:bg-[#5a5c80] text-white focus:ring-gray-400",
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-[#31394d] hover:bg-[#3c4761] text-white focus:ring-gray-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    warn: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
    ghost:
      "bg-transparent hover:bg-[#31394d] text-gray-300 focus:ring-gray-400",
  };

  // Disabled classes
  const disabledClasses = "opacity-50 cursor-not-allowed";

  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.default}
    ${disabled ? disabledClasses : ""}
    ${widthClasses}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
