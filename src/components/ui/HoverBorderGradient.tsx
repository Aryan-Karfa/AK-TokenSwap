import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const HoverBorderGradient: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={cn(
        "relative flex rounded-lg border border-neutral-800 bg-neutral-900 p-[1px] transition-colors duration-300 cursor-pointer overflow-hidden focus-ring",
        className
      )}
    >
      <div className="relative z-10 w-full rounded-[7px] bg-neutral-950 px-4 py-2 text-sm text-neutral-100 transition-colors duration-300 flex items-center justify-center h-[38px]">
        {children}
      </div>
      {/* Border gradient highlight */}
      <motion.div
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.5)_0%,rgba(139,92,246,0.5)_50%,transparent_100%)] pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1.5 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        style={{
          width: "200%",
          height: "200%",
          left: "-50%",
          top: "-50%",
        }}
      />
    </button>
  );
};
