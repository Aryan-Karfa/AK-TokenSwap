/**
 * Wallet operations helper service.
 * TODO: Implement wallet detection, account retrieval, and balance check in subsequent phases.
 */

export const isWalletInstalled = (): boolean => {
  // TODO: Check if Freighter or other wallets are installed in the browser.
  return false;
};

export const getAccountAddress = async (): Promise<string | null> => {
  // TODO: Retrieve public address of connected account.
  return null;
};
