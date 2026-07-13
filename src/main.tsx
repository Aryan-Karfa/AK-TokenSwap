import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/geist-sans";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { validateEnvironment } from "./config/app";

let startupError: Error | null = null;
try {
  validateEnvironment();
} catch (e: unknown) {
  startupError = e as Error;
}

const container = document.getElementById("root")!;
const root = createRoot(container);

if (startupError) {
  root.render(
    <StrictMode>
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-center text-white select-none">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 max-w-md shadow-2xl flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold tracking-tight text-rose-400">Configuration Error</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            The application failed to launch due to invalid or missing environment settings:
          </p>
          <pre className="w-full overflow-x-auto rounded-lg bg-neutral-900 p-3 text-xs text-rose-400 font-mono text-left max-h-32 select-all whitespace-pre-wrap">
            {startupError.message}
          </pre>
        </div>
      </div>
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
