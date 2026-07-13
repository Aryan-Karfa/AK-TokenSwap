import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Shield, Coins, ArrowRight } from "lucide-react";
import { Spotlight } from "../components/ui/Spotlight";
import { BackgroundBeams } from "../components/ui/BackgroundBeams";
import { AuroraBackground } from "../components/ui/AuroraBackground";
import { animate, stagger } from "animejs";

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

export const Home: React.FC = () => {
  useEffect(() => {
    animate(".animate-fade", {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 200,
      delay: stagger(45),
      easing: "easeOutQuad",
    });
  }, []);

  return (
    <AuroraBackground>
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full py-16 px-4 sm:px-6 lg:px-8 z-10">
        {/* Spotlight Overlay */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(139,92,246,0.3)" />

        {/* Background Beams */}
        <BackgroundBeams />

        {/* Hero Section */}
        <section className="text-center max-w-3xl my-12 relative z-25">
          <h1 className="animate-fade opacity-0 text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
            Swap Stellar Assets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">
              Instantly
            </span>
          </h1>
          <p className="animate-fade opacity-0 text-base sm:text-lg text-neutral-400 mb-8 max-w-xl mx-auto leading-relaxed">
            A clean, fast, and secure interface for swapping Stellar assets on the Stellar
            decentralized exchange.
          </p>
          <div className="animate-fade opacity-0 flex flex-wrap justify-center gap-4">
            <Link
              to="/swap"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-100 px-6 py-3.5 text-sm font-semibold text-neutral-900 hover:bg-white active:scale-95 transition-all cursor-pointer shadow-lg shadow-white/5"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer"
            >
              <GithubIcon className="h-4 w-4 text-neutral-400" />
              <span>GitHub</span>
            </a>
          </div>

          {/* Under Buttons Tags */}
          <div className="animate-fade opacity-0 flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mt-8 text-xs text-neutral-500 font-medium select-none">
            <span className="flex items-center gap-1.5">
              <span className="text-indigo-400">✓</span> Powered by Stellar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-indigo-400">✓</span> Testnet Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-indigo-400">✓</span> Open Source
            </span>
          </div>
        </section>

        {/* Features Section */}
        <section className="animate-fade opacity-0 max-w-5xl my-16 w-full border-t border-white/[0.04] pt-16 relative z-25">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-12 tracking-tight">
            Designed for Stellar Swaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* KokonutUI Cards */}
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-all duration-300">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Transactions</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Stellar's consensus protocol settles trades in under 5 seconds, enabling immediate
                path payment trades.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-all duration-300">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Trade directly from your self-custody Freighter wallet. Your private keys never
                leave your device.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] p-6 transition-all duration-300">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                <Coins className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Low Fees</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Execute swaps on-ledger for sub-penny fees, avoiding Ethereum-scale gas hikes.
              </p>
            </div>
          </div>
        </section>

        {/* Supported Assets Chips */}
        <section className="animate-fade opacity-0 max-w-3xl my-8 w-full text-center relative z-25">
          <h3 className="text-sm font-semibold tracking-wider text-neutral-500 uppercase mb-4 select-none">
            Supported Assets
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white font-medium select-none hover:bg-white/[0.06] transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              XLM
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white font-medium select-none hover:bg-white/[0.06] transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              USDC
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white font-medium select-none hover:bg-white/[0.06] transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              AQUA
            </span>
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-fade opacity-0 max-w-3xl my-12 w-full text-center border-t border-white/[0.04] pt-16 relative z-25">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to trade Stellar assets?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
            Experience non-custodial swaps with sub-penny fees.
          </p>
          <Link
            to="/swap"
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 border border-white/[0.08] hover:bg-neutral-800 px-6 py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer"
          >
            Enter Exchange
          </Link>
        </section>
      </div>
    </AuroraBackground>
  );
};
