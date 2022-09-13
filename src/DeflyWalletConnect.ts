import WalletConnect from "@walletconnect/client";
import {formatJsonRpcRequest} from "@json-rpc-tools/utils/dist/cjs/format";

import DeflyWalletConnectError from "./util/DeflyWalletConnectError";
import {
  openDeflyWalletConnectModal,
  openDeflyWalletRedirectModal,
  removeModalWrapperFromDOM,
  DEFLY_WALLET_CONNECT_MODAL_ID,
  DEFLY_WALLET_REDIRECT_MODAL_ID,
  openDeflyWalletSignTxnToast,
  DEFLY_WALLET_SIGN_TXN_TOAST_ID
} from "./modal/deflyWalletConnectModalUtils";
import {
  getLocalStorage,
  resetWalletDetailsFromStorage,
  saveWalletDetailsToStorage
} from "./util/storage/storageUtils";
import {assignBridgeURL, listBridgeServers} from "./util/api/deflyWalletConnectApi";
import {DEFLY_WALLET_LOCAL_STORAGE_KEYS} from "./util/storage/storageConstants";
import {DeflyWalletTransaction, SignerTransaction} from "./util/model/deflyWalletModels";
import {
  base64ToUint8Array,
  encodeUnsignedTransactionInBase64
} from "./util/transaction/transactionUtils";
import {isMobile} from "./util/device/deviceUtils";
import {AppMeta} from "./util/deflyWalletTypes";
import {
  generateDeflyWalletAppDeepLink,
  getDeflyWalletAppMeta
} from "./util/deflyWalletUtils";

interface DeflyWalletConnectOptions {
  bridge?: string;
  deep_link?: string;
  app_meta?: AppMeta;
  shouldShowSignTxnToast?: boolean;
}

function generateDeflyWalletConnectModalActions(rejectPromise?: (error: any) => void) {
  return {
    open: openDeflyWalletConnectModal(rejectPromise),
    close: () => removeModalWrapperFromDOM(DEFLY_WALLET_CONNECT_MODAL_ID)
  };
}

class DeflyWalletConnect {
  bridge: string;
  connector: WalletConnect | null;
  shouldShowSignTxnToast: boolean;

  constructor(options?: DeflyWalletConnectOptions) {
    this.bridge =
      options?.bridge ||
      getLocalStorage()?.getItem(DEFLY_WALLET_LOCAL_STORAGE_KEYS.BRIDGE_URL) ||
      "";

    if (options?.deep_link) {
      getLocalStorage()?.setItem(
        DEFLY_WALLET_LOCAL_STORAGE_KEYS.DEEP_LINK,
        options.deep_link
      );
    }

    if (options?.app_meta) {
      getLocalStorage()?.setItem(
        DEFLY_WALLET_LOCAL_STORAGE_KEYS.APP_META,
        JSON.stringify(options.app_meta)
      );
    }

    this.connector = null;
    this.shouldShowSignTxnToast =
      typeof options?.shouldShowSignTxnToast === "undefined"
        ? true
        : options.shouldShowSignTxnToast;
  }

  connect() {
    return new Promise<string[]>(async (resolve, reject) => {
      try {
        // check if already connected and kill session first before creating a new one.
        // This is to kill the last session and make sure user start from scratch whenever `.connect()` method is called.
        if (this.connector?.connected) {
          await this.connector.killSession();
        }

        let bridgeURL = "";

        if (!this.bridge) {
          bridgeURL = await assignBridgeURL();
        }

        // Create Connector instance
        this.connector = new WalletConnect({
          bridge: this.bridge || bridgeURL,
          qrcodeModal: generateDeflyWalletConnectModalActions(reject)
        });

        await this.connector.createSession({
          chainId: 4160
        });

        this.connector.on("connect", (error, _payload) => {
          if (error) {
            reject(error);
          }

          resolve(this.connector?.accounts || []);

          saveWalletDetailsToStorage(this.connector?.accounts || []);
        });
      } catch (error: any) {
        console.log(error);

        const {name} = getDeflyWalletAppMeta();

        reject(
          new DeflyWalletConnectError(
            {
              type: "SESSION_CONNECT",
              detail: error
            },
            error.message || `There was an error while connecting to ${name}`
          )
        );
      }
    });
  }

  async reconnectSession() {
    try {
      if (this.connector) {
        return this.connector.accounts || [];
      }

      // Fetch the active bridge servers
      const response = await listBridgeServers();

      if (response.servers.includes(this.bridge)) {
        this.connector = new WalletConnect({
          bridge: this.bridge,
          qrcodeModal: generateDeflyWalletConnectModalActions()
        });

        return this.connector?.accounts || [];
      }

      throw new DeflyWalletConnectError(
        {
          type: "SESSION_RECONNECT",
          detail: ""
        },
        "The bridge server is not active anymore. Disconnecting."
      );
    } catch (error: any) {
      // If the bridge is not active, then disconnect
      this.disconnect();

      const {name} = getDeflyWalletAppMeta();

      throw new DeflyWalletConnectError(
        {
          type: "SESSION_RECONNECT",
          detail: error
        },
        error.message || `There was an error while reconnecting to ${name}`
      );
    }
  }

  disconnect() {
    const killPromise = this.connector?.killSession();

    killPromise?.then(() => {
      this.connector = null;
    });

    resetWalletDetailsFromStorage();

    return killPromise;
  }

  signTransaction(
    txGroups: SignerTransaction[][],
    signerAddress?: string
  ): Promise<Uint8Array[]> {
    if (!this.connector) {
      throw new Error("DeflyWalletConnect was not initialized correctly.");
    }

    if (isMobile()) {
      let deflyWalletAppDeeplink;

      try {
        // This is to automatically open the wallet app when trying to sign with it.
        deflyWalletAppDeeplink = window.open(generateDeflyWalletAppDeepLink(), "_blank");
      } catch (error) {
        console.log(error);
      } finally {
        if (!deflyWalletAppDeeplink) {
          openDeflyWalletRedirectModal();
        }
      }
    } else if (!isMobile() && this.shouldShowSignTxnToast) {
      // This is to inform user go the wallet app when trying to sign with it.
      openDeflyWalletSignTxnToast();
    }

    const signTxnRequestParams = txGroups.flatMap((txGroup) =>
      txGroup.map<DeflyWalletTransaction>((txGroupDetail) => {
        let signers: DeflyWalletTransaction["signers"];

        if (signerAddress && !(txGroupDetail.signers || []).includes(signerAddress)) {
          signers = [];
        }

        const txnRequestParams: DeflyWalletTransaction = {
          txn: encodeUnsignedTransactionInBase64(txGroupDetail.txn)
        };

        if (Array.isArray(signers)) {
          txnRequestParams.signers = signers;
        }

        return txnRequestParams;
      })
    );

    const formattedSignTxnRequest = formatJsonRpcRequest("algo_signTxn", [
      signTxnRequestParams
    ]);

    return this.connector
      .sendCustomRequest(formattedSignTxnRequest)
      .then((response: (string | null | Uint8Array)[]): Uint8Array[] => {
        // We send the full txn group to the mobile wallet.
        // Therefore, we first filter out txns that were not signed by the wallet.
        // These are received as `null`.
        const nonNullResponse = response.filter(Boolean) as (string | number[])[];

        // android returns a response Uint8Array[]
        // ios returns base64String[]
        return typeof nonNullResponse[0] === "string"
          ? (nonNullResponse as string[]).map(base64ToUint8Array)
          : (nonNullResponse as number[][]).map((item) => Uint8Array.from(item));
      })
      .catch((error) =>
        Promise.reject(
          new DeflyWalletConnectError(
            {
              type: "SIGN_TRANSACTIONS",
              detail: error
            },
            error.message || "Failed to sign transaction"
          )
        )
      )
      .finally(() => {
        removeModalWrapperFromDOM(DEFLY_WALLET_REDIRECT_MODAL_ID);
        removeModalWrapperFromDOM(DEFLY_WALLET_SIGN_TXN_TOAST_ID);
      });
  }
}

export default DeflyWalletConnect;
