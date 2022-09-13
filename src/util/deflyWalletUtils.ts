import DeflyWalletLogo from "../asset/icon/DeflyWallet.svg";

import {detectBrowser, isAndroid, isIOS} from "./device/deviceUtils";
import {DEFLY_WALLET_APP_DEEP_LINK} from "./deflyWalletConstants";
import {AppMeta} from "./deflyWalletTypes";
import {DEFLY_WALLET_LOCAL_STORAGE_KEYS} from "./storage/storageConstants";
import {getLocalStorage} from "./storage/storageUtils";

function generateDeflyWalletAppDeepLink(shouldAddBrowserName = true): string {
  let appDeepLink =
    getLocalStorage()?.getItem(DEFLY_WALLET_LOCAL_STORAGE_KEYS.DEEP_LINK) ||
    DEFLY_WALLET_APP_DEEP_LINK;
  const browserName = detectBrowser();

  if (shouldAddBrowserName && browserName) {
    appDeepLink = `${appDeepLink}?browser=${encodeURIComponent(browserName)}`;
  }

  return appDeepLink;
}

function getDeflyWalletAppMeta(): AppMeta {
  const storedAppMeta = getLocalStorage()?.getItem(
    DEFLY_WALLET_LOCAL_STORAGE_KEYS.APP_META
  );

  if (storedAppMeta) {
    return JSON.parse(storedAppMeta) as AppMeta;
  }

  return {
    logo: DeflyWalletLogo,
    name: "Defly Wallet",
    main_color: "#ffee55"
  };
}

/**
 * @param {string} uri WalletConnect uri
 * @returns {string} Defly Wallet deeplink
 *
 */
function generateDeflyWalletConnectDeepLink(uri: string): string {
  let appDeepLink = generateDeflyWalletAppDeepLink(false);

  // Add `wc` suffix to the deeplink if it doesn't exist
  if (isIOS() && !appDeepLink.includes("-wc")) {
    appDeepLink = appDeepLink.replace("://", "-wc://");
  }

  let deepLink = `${appDeepLink}wc?uri=${encodeURIComponent(uri)}`;
  const browserName = detectBrowser();

  if (isAndroid()) {
    deepLink = uri;
  }

  if (browserName) {
    deepLink = `${deepLink}&browser=${encodeURIComponent(browserName)}`;
  }

  return deepLink;
}

export {
  generateDeflyWalletAppDeepLink,
  getDeflyWalletAppMeta,
  generateDeflyWalletConnectDeepLink
};
