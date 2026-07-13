const isDev = import.meta.env.DEV;

export const logger = {
  info: (message: string, ...optionalParams: unknown[]): void => {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`[INFO] [StellarSwap] ${message}`, ...optionalParams);
    }
  },
  warn: (message: string, ...optionalParams: unknown[]): void => {
    if (isDev) {
      console.warn(`[WARN] [StellarSwap] ${message}`, ...optionalParams);
    }
  },
  error: (message: string, error?: unknown, ...optionalParams: unknown[]): void => {
    if (isDev) {
      console.error(`[ERROR] [StellarSwap] ${message}`, error, ...optionalParams);
    } else {
      console.error(`[ERROR] [StellarSwap] ${message}`);
    }
  },
};
