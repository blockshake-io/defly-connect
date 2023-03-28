// eslint-disable-next-line import/no-unresolved
import {IWalletConnectSession} from "@walletconnect/types";

import {DeflyWalletDetails, DeflyWalletPlatformType } from "../deflyWalletTypes";
import {DEFLY_WALLET_LOCAL_STORAGE_KEYS} from "./storageConstants";

function getLocalStorage() {
  return typeof localStorage === "undefined" ? undefined : localStorage;
}

function saveWalletDetailsToStorage(
  accounts: string[],
  type?: "defly-wallet"
) {
  getLocalStorage()?.setItem(
    DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLET,
    JSON.stringify({
      type: type || "defly-wallet",
      accounts,
      selectedAccount: accounts[0]
    })
  );
}

function getWalletDetailsFromStorage(): DeflyWalletDetails | null {
  const storedWalletDetails = getLocalStorage()?.getItem(
    DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLET
  );

  if (storedWalletDetails) {
    return JSON.parse(storedWalletDetails) as DeflyWalletDetails;
  }

  return null;
}

function getWalletConnectObjectFromStorage(): IWalletConnectSession | null {
  const storedWalletConnectObject = getLocalStorage()?.getItem(
    DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLETCONNECT
  );

  if (storedWalletConnectObject) {
    return JSON.parse(storedWalletConnectObject) as IWalletConnectSession;
  }

  return null;
}

function resetWalletDetailsFromStorage() {
  return new Promise<undefined>((resolve, reject) => {
    try {
      getLocalStorage()?.removeItem(DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLETCONNECT);
      getLocalStorage()?.removeItem(DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLET);
      resolve(undefined);
    } catch (error) {
      reject(error);
    }
  });
}

function getWalletPlatformFromStorage() {
  const walletDetails = getWalletDetailsFromStorage();
  let walletType: DeflyWalletPlatformType = null;

  if (walletDetails?.type === "defly-wallet") {
    walletType = "mobile";
  }

  return walletType;
}

export {
  getLocalStorage,
  saveWalletDetailsToStorage,
  resetWalletDetailsFromStorage,
  getWalletDetailsFromStorage,
  getWalletConnectObjectFromStorage,
  getWalletPlatformFromStorage
};
