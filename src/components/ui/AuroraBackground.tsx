import React from "react";

export const AuroraBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 transition-bg duration-300 w-full h-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-40 filter blur-[100px] bg-[radial-gradient(circle_at_50%_120%,rgba(139,92,246,0.15),rgba(99,102,241,0.15),rgba(6,182,212,0.1),transparent_50%)] animate-aurora" />
      </div>
      {children}
    </div>
  );
};
