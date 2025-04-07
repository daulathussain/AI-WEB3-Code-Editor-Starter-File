"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

/**
 * Modal component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} [props.size='md'] - Modal size (sm, md, lg, xl, full)
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
 * @param {React.ReactNode} [props.footer] - Modal footer content
 * @param {string} [props.className] - Additional CSS classes for the modal content
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  footer,
  className = "",
}) => {
  const modalRef = useRef(null);

  // Handle ESC key to close the modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling of the body when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Handle clicking outside the modal to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  // If modal is not open, don't render anything
  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div
        ref={modalRef}
        className={`bg-[#252536] rounded-md shadow-lg w-full ${
          sizeClasses[size] || sizeClasses.md
        } ${className}`}
      >
        {/* Modal header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#464866]">
            {title && (
              <h3 className="text-lg font-medium text-gray-200">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 rounded hover:bg-[#31394d] hover:text-white focus:outline-none"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}

        {/* Modal body */}
        <div className="px-4 py-3 overflow-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>

        {/* Modal footer */}
        {footer && (
          <div className="flex justify-end px-4 py-3 border-t border-[#464866] gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

/**
 * Confirmation modal with Yes/No buttons
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes",
  cancelText = "No",
  confirmVariant = "primary",
  size = "sm",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-300">{message}</p>
    </Modal>
  );
};

export default Modal;
