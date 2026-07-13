import React from "react";
import { motion } from "framer-motion";

export const BackgroundBeams: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Repeating animated path flows */}
        <motion.path
          d="M 150 -100 L 150 1200"
          stroke="url(#beam-grad)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: [0.1, 0.35, 0.1], pathOffset: [0, 1.2] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.path
          d="M 400 -100 L 600 1200"
          stroke="url(#beam-grad)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: [0.2, 0.4, 0.2], pathOffset: [-0.2, 1.1] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "linear",
            delay: 1.5,
          }}
        />

        <motion.path
          d="M 750 -100 L 650 1200"
          stroke="url(#beam-grad)"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: [0.1, 0.3, 0.1], pathOffset: [0, 1.2] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
            delay: 3,
          }}
        />

        <motion.path
          d="M 1100 -100 L 950 1200"
          stroke="url(#beam-grad)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: [0.15, 0.35, 0.15], pathOffset: [-0.1, 1.2] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 4.5,
          }}
        />
      </svg>
    </div>
  );
};
