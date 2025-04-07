"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

/**
 * Dropdown component with toggle button and dropdown menu
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - Custom trigger element (if buttonLabel is not provided)
 * @param {string} [props.buttonLabel] - Label for the dropdown button
 * @param {React.ReactNode} props.children - Dropdown menu content
 * @param {string} [props.align='left'] - Dropdown menu alignment (left, right)
 * @param {string} [props.width='auto'] - Dropdown menu width (auto, full)
 * @param {boolean} [props.disabled=false] - Whether the dropdown is disabled
 * @param {string} [props.className] - Additional CSS classes for the dropdown
 * @param {string} [props.buttonClassName] - Additional CSS classes for the dropdown button
 * @param {string} [props.menuClassName] - Additional CSS classes for the dropdown menu
 */
const Dropdown = ({
  trigger,
  buttonLabel,
  children,
  align = "left",
  width = "auto",
  disabled = false,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Alignment classes
  const alignmentClasses = {
    left: "left-0",
    right: "right-0",
  };

  // Width classes
  const widthClasses = {
    auto: "min-w-[10rem]",
    full: "w-full",
  };

  // Default button when no custom trigger is provided
  const defaultButton = (
    <button
      type="button"
      className={`flex items-center justify-between px-3 py-2 bg-[#31394d] hover:bg-[#3c4761] text-white rounded ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${buttonClassName}`}
      onClick={toggleDropdown}
      disabled={disabled}
    >
      <span>{buttonLabel}</span>
      <FaChevronDown
        className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        size={12}
      />
    </button>
  );

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown trigger */}
      {trigger ? (
        <div
          onClick={toggleDropdown}
          className={
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }
        >
          {trigger}
        </div>
      ) : (
        defaultButton
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`absolute z-10 mt-1 bg-[#252536] border border-[#464866] rounded-md shadow-lg ${
            alignmentClasses[align] || alignmentClasses.left
          } ${widthClasses[width] || widthClasses.auto} ${menuClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Dropdown item component
 */
export const DropdownItem = ({
  onClick,
  children,
  disabled = false,
  danger = false,
  className = "",
  icon,
}) => {
  const baseClasses =
    "flex items-center w-full px-4 py-2 text-sm text-left hover:bg-[#31394d] focus:outline-none";

  const variantClasses = danger
    ? "text-red-400 hover:text-red-300"
    : "text-gray-300 hover:text-white";

  const stateClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses} ${stateClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

/**
 * Dropdown divider component
 */
export const DropdownDivider = () => {
  return <div className="border-t border-[#464866] my-1" />;
};

/**
 * Dropdown header component
 */
export const DropdownHeader = ({ children, className = "" }) => {
  return (
    <div
      className={`px-4 py-2 text-xs font-semibold text-gray-400 ${className}`}
    >
      {children}
    </div>
  );
};

export default Dropdown;
