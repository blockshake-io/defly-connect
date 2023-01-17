/* eslint-disable max-lines */
import WalletConnect from '@walletconnect/client';

import DeflyWalletConnectError from './util/DeflyWalletConnectError';
import {
  openDeflyWalletConnectModal,
  openDeflyWalletRedirectModal,
  removeModalWrapperFromDOM,
  DEFLY_WALLET_CONNECT_MODAL_ID,
  DEFLY_WALLET_REDIRECT_MODAL_ID,
  openDeflyWalletSignTxnToast,
  DEFLY_WALLET_SIGN_TXN_TOAST_ID,
  DeflyWalletModalConfig,
  setupDeflyWalletConnectModalCloseListener
} from './modal/deflyWalletConnectModalUtils';
import {
  resetWalletDetailsFromStorage,
  saveWalletDetailsToStorage,
  getWalletConnectObjectFromStorage,
  getWalletPlatformFromStorage
} from './util/storage/storageUtils';
import { getDeflyConnectConfig } from './util/api/deflyWalletConnectApi';
import { DEFLY_WALLET_LOCAL_STORAGE_KEYS } from './util/storage/storageConstants';
import { DeflyWalletTransaction, SignerTransaction } from './util/model/deflyWalletModels';
import {
  base64ToUint8Array,
  composeTransaction,
  formatJsonRpcRequest
} from './util/transaction/transactionUtils';
import { isMobile } from './util/device/deviceUtils';
import { AlgorandChainIDs } from './util/deflyWalletTypes';

interface DeflyWalletConnectOptions {
  bridge?: string;
  shouldShowSignTxnToast?: boolean;
  chainId?: AlgorandChainIDs;
}

function generateDeflyWalletConnectModalActions({ shouldUseSound }: DeflyWalletModalConfig) {
  return {
    open: openDeflyWalletConnectModal({
      shouldUseSound
    }),
    close: () => removeModalWrapperFromDOM(DEFLY_WALLET_CONNECT_MODAL_ID)
  };
}

class DeflyWalletConnect {
  bridge: string;
  connector: WalletConnect | null;
  shouldShowSignTxnToast: boolean;
  chainId?: number;

  constructor(options?: DeflyWalletConnectOptions) {
    this.bridge = options?.bridge || '';

    this.connector = null;
    this.shouldShowSignTxnToast =
      typeof options?.shouldShowSignTxnToast === 'undefined'
        ? true
        : options.shouldShowSignTxnToast;

    this.chainId = options?.chainId;
  }

  get platform() {
    return getWalletPlatformFromStorage();
  }

  get isConnected() {
    if (this.platform === 'mobile') {
      return !!this.connector;
    }

    return false;
  }

  connect() {
    return new Promise<string[]>(async (resolve, reject) => {
      try {
        // check if already connected and kill session first before creating a new one.
        // This is to kill the last session and make sure user start from scratch whenever `.connect()` method is called.
        if (this.connector?.connected) {
          try {
            await this.connector.killSession();
          } catch (_error) {
            // No need to handle
          }
        }
        const {
          bridgeURL,
          shouldUseSound
        } = await getDeflyConnectConfig();


        // Create Connector instance
        this.connector = new WalletConnect({
          bridge: this.bridge || bridgeURL || 'https://bridge.walletconnect.org',
          storageId: DEFLY_WALLET_LOCAL_STORAGE_KEYS.WALLETCONNECT,
          qrcodeModal: generateDeflyWalletConnectModalActions({
            shouldUseSound
          })
        });

        await this.connector.createSession({
          // eslint-disable-next-line no-magic-numbers
          chainId: this.chainId || 4160
        });

        setupDeflyWalletConnectModalCloseListener(() =>
          reject(
            new DeflyWalletConnectError(
              {
                type: 'CONNECT_MODAL_CLOSED'
              },
              'Connect modal is closed by user'
            )
          )
        );

        this.connector.on('connect', (error, _payload) => {
          if (error) {
            reject(error);
          }

          resolve(this.connector?.accounts || []);

          saveWalletDetailsToStorage(this.connector?.accounts || []);
        });
      } catch (error: any) {
        reject(
          new DeflyWalletConnectError(
            {
              type: 'SESSION_CONNECT',
              detail: error
            },
            error.message || `There was an error while connecting to Defly Wallet`
          )
        );
      }
    });
  }

  reconnectSession() {
    return new Promise<string[]>(async (resolve, reject) => {
      try {

        // ================================================= //
        // Defly Mobile Wallet flow
        if (this.connector) {
          resolve(this.connector.accounts || []);
        }

        this.bridge = getWalletConnectObjectFromStorage()?.bridge || '';

        if (this.bridge) {
          this.connector = new WalletConnect({
            bridge: this.bridge
          });

          resolve(this.connector?.accounts || []);
        }

        // ================================================= //

        // If there is no wallet details in storage, resolve the promise with empty array
        if (!this.isConnected) {
          resolve([]);
        }
      } catch (error: any) {
        // If the bridge is not active, then disconnect
        await this.disconnect();

        reject(
          new DeflyWalletConnectError(
            {
              type: 'SESSION_RECONNECT',
              detail: error
            },
            error.message || `There was an error while reconnecting to Defly Wallet`
          )
        );
      }
    });
  }

  async disconnect() {
    let killPromise: Promise<void> | undefined;

    if (this.isConnected && this.platform === 'mobile') {
      killPromise = this.connector?.killSession();

      killPromise?.then(() => {
        this.connector = null;
      });
    }

    await resetWalletDetailsFromStorage();
  }

  private async signTransactionWithMobile(signTxnRequestParams: DeflyWalletTransaction[]) {
    const formattedSignTxnRequest = formatJsonRpcRequest('algo_signTxn', [
      signTxnRequestParams
    ]);

    try {
      try {
        const { silent } = await getDeflyConnectConfig();

        const response = await this.connector!.sendCustomRequest(
          formattedSignTxnRequest,
          {
            forcePushNotification: !silent
          }
        );

        // We send the full txn group to the mobile wallet.
        // Therefore, we first filter out txns that were not signed by the wallet.
        // These are received as `null`.
        const nonNullResponse = response.filter(Boolean) as (string | number[])[];

        return typeof nonNullResponse[0] === 'string'
          ? (nonNullResponse as string[]).map(base64ToUint8Array)
          : (nonNullResponse as number[][]).map((item) => Uint8Array.from(item));
      } catch (error) {
        return await Promise.reject(
          new DeflyWalletConnectError(
            {
              type: 'SIGN_TRANSACTIONS',
              detail: error
            },
            error.message || 'Failed to sign transaction'
          )
        );
      }
    } finally {
      removeModalWrapperFromDOM(DEFLY_WALLET_REDIRECT_MODAL_ID);
      removeModalWrapperFromDOM(DEFLY_WALLET_SIGN_TXN_TOAST_ID);
    }
  }


  // eslint-disable-next-line require-await
  async signTransaction(
    txGroups: SignerTransaction[][],
    signerAddress?: string
  ): Promise<Uint8Array[]> {
    if (this.platform === 'mobile') {
      if (isMobile()) {
        // This is to automatically open the wallet app when trying to sign with it.
        openDeflyWalletRedirectModal();
      } else if (!isMobile() && this.shouldShowSignTxnToast) {
        // This is to inform user go the wallet app when trying to sign with it.
        openDeflyWalletSignTxnToast();
      }

      if (!this.connector) {
        throw new Error('DeflyWalletConnect was not initialized correctly.');
      }
    }

    // Prepare transactions to be sent to wallet
    const signTxnRequestParams = txGroups.flatMap((txGroup) =>
      txGroup.map<DeflyWalletTransaction>((txGroupDetail) =>
        composeTransaction(txGroupDetail, signerAddress)
      )
    );

    // ================================================= //
    // Defly Mobile Wallet flow
    return this.signTransactionWithMobile(signTxnRequestParams);
    // ================================================= //
  }
}

export default DeflyWalletConnect;
/* eslint-enable max-lines */
