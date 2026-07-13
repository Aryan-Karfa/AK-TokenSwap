import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-neutral-950 py-16 px-4 sm:px-6 lg:px-8 flex-1">
      {/* Hero Section */}
      <section className="text-center max-w-3xl my-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-100 mb-6">
          Decentralized Token Swaps on Stellar
        </h1>
        <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
          Fast, secure, and low-cost token swaps. Access the Stellar Decentralized Exchange with zero friction.
        </p>
        <div>
          <Link
            to="/swap"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-100 px-6 py-3 text-base font-semibold text-neutral-900 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Launch App
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl my-16 w-full border-t border-neutral-900 pt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-neutral-100 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/10 p-6 text-left">
            <h3 className="text-lg font-bold text-neutral-200 mb-2">Instant Swaps</h3>
            <p className="text-sm text-neutral-400">
              Trade Stellar tokens immediately through direct and path payment operations with minimal slippage.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/10 p-6 text-left">
            <h3 className="text-lg font-bold text-neutral-200 mb-2">Wallet Integration</h3>
            <p className="text-sm text-neutral-400">
              Connect securely using the Freighter Wallet extension to sign and execute transactions.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/10 p-6 text-left">
            <h3 className="text-lg font-bold text-neutral-200 mb-2">Stellar Speed & Fees</h3>
            <p className="text-sm text-neutral-400">
              Benefit from the speed of the Stellar Network with transaction settlement under 5 seconds and sub-penny fees.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl my-12 w-full text-center border-t border-neutral-900 pt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-4">
          Ready to swap?
        </h2>
        <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
          Get started today by connecting your wallet. Swap between XLM, USDC, and AQUA in seconds.
        </p>
        <Link
          to="/swap"
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 px-6 py-3 text-base font-semibold text-neutral-100 transition-colors cursor-pointer"
        >
          Enter Exchange
        </Link>
      </section>
    </div>
  );
};
