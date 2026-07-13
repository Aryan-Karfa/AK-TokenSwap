import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  getAddress,
  isConnected as checkFreighterConnected,
  requestAccess,
  getNetwork,
  WatchWalletChanges,
} from "@stellar/freighter-api";
import { Horizon } from "@stellar/stellar-sdk";
import { HORIZON_URL, STELLAR_NETWORK } from "../services/stellar";
import { runDiagnostics } from "../utils/diagnostics";

export interface BalanceLine {
  balance: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
}

export interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  network: string | null;
  networkWarning: string | null;
  balances: BalanceLine[];
  isLoadingBalances: boolean;
  freighterAvailable: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalances: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);
  const [networkWarning, setNetworkWarning] = useState<string | null>(null);
  const [balances, setBalances] = useState<BalanceLine[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [freighterAvailable, setFreighterAvailable] = useState(true);

  // Check if Freighter extension is available in client
  const checkWalletInstalled = useCallback(async () => {
    try {
      const res = await checkFreighterConnected();
      setFreighterAvailable(res.isConnected);
      return res.isConnected;
    } catch {
      setFreighterAvailable(false);
      return false;
    }
  }, []);

  // Fetch balances from Horizon Testnet
  const refreshBalances = useCallback(async () => {
    if (!address) {
      setBalances([]);
      return;
    }
    setIsLoadingBalances(true);
    try {
      const server = new Horizon.Server(HORIZON_URL);
      const account = await server.loadAccount(address);

      // Parse balances safely to match BalanceLine structure
      const parsedBalances: BalanceLine[] = account.balances.map((b: unknown) => {
        const balanceObj = b as Record<string, string>;
        return {
          balance: balanceObj.balance,
          asset_type: balanceObj.asset_type,
          asset_code: balanceObj.asset_code,
          asset_issuer: balanceObj.asset_issuer,
        };
      });

      setBalances(parsedBalances);
    } catch (e: unknown) {
      console.warn(
        "Failed to load balances from Horizon (Account might be unfunded on Testnet):",
        e
      );
      // Fallback native XLM balance if account doesn't exist on testnet yet
      setBalances([
        {
          balance: "0.0000000",
          asset_type: "native",
        },
      ]);
    } finally {
      setIsLoadingBalances(false);
    }
  }, [address]);

  // Connect Freighter
  const connect = useCallback(async () => {
    const installed = await checkWalletInstalled();
    if (!installed) {
      return;
    }
    setIsConnecting(true);
    try {
      const res = await requestAccess();
      if (res.error) {
        console.error("Access request rejected by user:", res.error);
        return;
      }
      if (res.address) {
        setAddress(res.address);
        setIsConnected(true);
      }

      const net = await getNetwork();
      setNetwork(net.network);

      // Run dev diagnostics on connection
      await runDiagnostics("Wallet Connection Success");

      if (net.network !== STELLAR_NETWORK) {
        setNetworkWarning(
          `Freighter is not connected to ${STELLAR_NETWORK}. Please switch networks in settings.`
        );
      } else {
        setNetworkWarning(null);
      }
    } catch (e: unknown) {
      console.error("Failed to connect Freighter wallet:", e);
    } finally {
      setIsConnecting(false);
    }
  }, [checkWalletInstalled]);

  // Disconnect
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setBalances([]);
    setNetwork(null);
    setNetworkWarning(null);
  }, []);

  // Fetch balances when connection updates
  useEffect(() => {
    if (isConnected && address) {
      refreshBalances();
    }
  }, [isConnected, address, refreshBalances]);

  // Initialize and watch Freighter wallet changes
  useEffect(() => {
    let watcher: InstanceType<typeof WatchWalletChanges> | null = null;
    checkWalletInstalled().then((installed) => {
      if (installed) {
        // Silently retrieve address if allowed
        getAddress().then((res) => {
          if (res.address) {
            setAddress(res.address);
            setIsConnected(true);
            getNetwork().then((net) => {
              setNetwork(net.network);

              // Run diagnostics silently on startup
              runDiagnostics("Wallet Auto-Connect");

              if (net.network !== STELLAR_NETWORK) {
                setNetworkWarning(
                  `Freighter is not connected to ${STELLAR_NETWORK}. Please switch networks.`
                );
              }
            });
          }
        });

        // Instantiate Freighter changes watcher
        watcher = new WatchWalletChanges();
        watcher.watch((changes: { address: string }) => {
          if (changes.address) {
            setAddress(changes.address);
            setIsConnected(true);
          } else {
            setAddress(null);
            setIsConnected(false);
            setBalances([]);
          }
        });
      }
    });

    return () => {
      if (watcher) {
        watcher.stop();
      }
    };
  }, [checkWalletInstalled]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        network,
        networkWarning,
        balances,
        isLoadingBalances,
        freighterAvailable,
        connect,
        disconnect,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
