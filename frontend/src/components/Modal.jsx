import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-none transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${maxWidth} bg-white rounded-2xl border border-[#E8E0DE] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden transition-all page-enter`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0DE] bg-[#F5F1F0]/50">
            <h3 className="font-serif text-base font-bold text-[#1A1A1A]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 text-[#6B6B6B] hover:text-[#1A1A1A] rounded-lg hover:bg-[#E8E0DE]/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
