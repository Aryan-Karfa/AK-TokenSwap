import React from "react";
import { Link, NavLink } from "react-router-dom";
import { WalletButton } from "./WalletButton";
import { Coins } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.04] bg-neutral-950/70 backdrop-blur-md select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Project Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white hover:text-indigo-400 transition-colors focus-ring rounded-lg px-2 py-1"
          >
            <Coins className="h-5 w-5 text-indigo-500 animate-pulse" />
            <span>StellarSwap</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-neutral-200 focus-ring rounded-lg px-2.5 py-1 ${
                isActive ? "text-white font-semibold" : "text-neutral-400"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/swap"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-neutral-200 focus-ring rounded-lg px-2.5 py-1 ${
                isActive ? "text-white font-semibold" : "text-neutral-400"
              }`
            }
          >
            Swap
          </NavLink>
        </nav>

        {/* Wallet Button */}
        <div className="flex items-center">
          <WalletButton />
        </div>
      </div>
    </header>
  );
};
