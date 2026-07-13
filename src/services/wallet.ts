import { getAddress, isConnected, requestAccess } from "@stellar/freighter-api";

export const connectWallet = async (): Promise<string | null> => {
  const freighter = await isConnected();
  if (!freighter.isConnected) {
    throw new Error("Freighter wallet extension is not installed.");
  }
  const access = await requestAccess();
  if (access.error) {
    throw new Error(access.error.message || "Freighter connection request rejected.");
  }
  return access.address;
};

export const getConnectedAccount = async (): Promise<string | null> => {
  const res = await getAddress();
  if (res.error) {
    return null;
  }
  return res.address || null;
};
