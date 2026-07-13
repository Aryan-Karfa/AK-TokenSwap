import React from "react";
import { Link, NavLink } from "react-router-dom";
import { WalletButton } from "./WalletButton";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Project Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold tracking-tight text-neutral-100 hover:text-white transition-colors">
            StellarSwap
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-neutral-200 ${
                isActive ? "text-neutral-100 font-semibold" : "text-neutral-400"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/swap"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-neutral-200 ${
                isActive ? "text-neutral-100 font-semibold" : "text-neutral-400"
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
