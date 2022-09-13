if (typeof window !== "undefined") {
  // Pollyfill for Buffer
  (window as any).global = window;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

// Components
import DeflyWalletConnect from "./DeflyWalletConnect";
// Utilities
import {closeDeflyWalletSignTxnToast} from "./modal/deflyWalletConnectModalUtils";

export {DeflyWalletConnect, closeDeflyWalletSignTxnToast};
