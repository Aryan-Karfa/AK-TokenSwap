import { useWallet } from "./useWallet";

export const useBalances = () => {
  const { balances, isLoadingBalances, refreshBalances } = useWallet();
  return { balances, isLoadingBalances, refreshBalances };
};
