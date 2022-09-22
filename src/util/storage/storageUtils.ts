import {DEFLY_WALLET_LOCAL_STORAGE_KEYS} from "./storageConstants";

function getLocalStorage() {
  return typeof localStorage === "undefined" ? undefined : localStorage;
}

function saveWalletDetailsToStorage(accounts: string[]) {
  getLocalStorage()?.setItem(
    DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLET,
    JSON.stringify({
      type: "defly-wallet",
      accounts,
      selectedAccount: accounts[0]
    })
  );
}

function resetWalletDetailsFromStorage() {
  return new Promise<undefined>((resolve, reject) => {
    try {
      getLocalStorage()?.removeItem(DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLETCONNECT);
      getLocalStorage()?.removeItem(DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLET);
      getLocalStorage()?.removeItem(DEFLY_WALLET_LOCAL_STORAGE_KEYS.BRIDGE_URL);
      resolve(undefined);
    } catch (error) {
      reject(error);
    }
  });
}

export {getLocalStorage, saveWalletDetailsToStorage, resetWalletDetailsFromStorage};
