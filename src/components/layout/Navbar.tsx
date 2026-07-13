import React from "react";
import { Link, NavLink } from "react-router-dom";
import { WalletButton } from "./WalletButton";
import { Coins } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-neutral-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Project Logo */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors"
          >
            <Coins className="h-6 w-6 text-indigo-500 animate-pulse" />
            <span>StellarSwap</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-neutral-200 ${
                isActive ? "text-white font-semibold" : "text-neutral-400"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/swap"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-neutral-200 ${
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
