import React from "react";

const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-neutral-950 bg-neutral-950/80 py-6 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-neutral-200">
            StellarSwap
          </span>
          <span className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} StellarSwap. All rights reserved.
          </span>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-6 text-sm text-neutral-400">
          <a
            href="#"
            className="hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            Documentation
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <span className="text-neutral-700 border-l border-neutral-800 pl-6 text-xs">
            Built on <span className="font-semibold text-neutral-300">Stellar</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
