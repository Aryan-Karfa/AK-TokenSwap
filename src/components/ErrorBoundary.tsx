import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught render error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 text-center text-white select-none">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 max-w-md shadow-2xl flex flex-col items-center gap-4">
            <AlertOctagon className="h-12 w-12 text-rose-500 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight text-white">Something went wrong</h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              An unexpected rendering crash occurred. Please reload the application or contact
              support if the issue persists.
            </p>
            {this.state.error && (
              <pre className="mt-2 w-full overflow-x-auto rounded-lg bg-neutral-900 p-3 text-xs text-rose-450 font-mono text-left max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-neutral-100 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-white active:scale-95 transition-all cursor-pointer shadow-lg shadow-white/5"
            >
              <RotateCw className="h-4 w-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
