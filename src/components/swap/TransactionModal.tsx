import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { animate, remove } from "animejs";

interface TransactionModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  title,
  children,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Reset existing animations using Anime.js v4 remove
      if (modalRef.current && backdropRef.current) {
        remove([modalRef.current, backdropRef.current]);
      }

      // Entrance animations
      if (modalRef.current) {
        animate(modalRef.current, {
          scale: [0.95, 1],
          opacity: [0, 1],
          duration: 350,
          easing: "easeOutBack",
        });
      }

      if (backdropRef.current) {
        animate(backdropRef.current, {
          opacity: [0, 1],
          duration: 200,
          easing: "easeOutQuad",
        });
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-950 p-6 shadow-2xl opacity-0 scale-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.03]">
          <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 text-sm text-neutral-400">{children}</div>
      </div>
    </div>
  );
};
