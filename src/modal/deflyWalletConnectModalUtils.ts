import DeflyWalletConnectError from '../util/DeflyWalletConnectError';
import { waitForElementCreatedAtShadowDOM } from '../util/dom/domUtils';

export interface DeflyWalletModalConfig {
  shouldUseSound: boolean;
}

// The ID of the wrapper element for DeflyWalletConnectModal
const DEFLY_WALLET_CONNECT_MODAL_ID = 'defly-wallet-connect-modal-wrapper';

// The ID of the wrapper element for DeflyWalletRedirectModal
const DEFLY_WALLET_REDIRECT_MODAL_ID = 'defly-wallet-redirect-modal-wrapper';

// The ID of the wrapper element for DeflyWalletSignTxnToast
const DEFLY_WALLET_SIGN_TXN_TOAST_ID = 'defly-wallet-sign-txn-toast-wrapper';

// The ID of the wrapper element for DeflyWalletSignTxnModal
const DEFLY_WALLET_SIGN_TXN_MODAL_ID = 'defly-wallet-sign-txn-modal-wrapper';

// The classname of Defly wallet modal
const DEFLY_WALLET_MODAL_CLASSNAME = 'defly-wallet-modal';

function createModalWrapperOnDOM(modalId: string) {
  const wrapper = document.createElement('div');

  wrapper.setAttribute('id', modalId);

  document.body.appendChild(wrapper);

  return wrapper;
}

function openDeflyWalletConnectModal(modalConfig: DeflyWalletModalConfig) {
  return (uri: string) => {
    if (!document.getElementById(DEFLY_WALLET_CONNECT_MODAL_ID)) {
      const root = createModalWrapperOnDOM(DEFLY_WALLET_CONNECT_MODAL_ID);
      const newURI = `${uri}&algorand=true`;
      const { shouldUseSound } = modalConfig;

      root.innerHTML = `<defly-wallet-connect-modal uri="${newURI}" should-use-sound="${shouldUseSound}"></defly-wallet-connect-modal>`;
    }
  };
}

function setupDeflyWalletConnectModalCloseListener(onClose: VoidFunction) {
  const deflyWalletConnectModalWrapper = document.getElementById(
    DEFLY_WALLET_CONNECT_MODAL_ID
  );

  const deflyWalletConnectModal = deflyWalletConnectModalWrapper
    ?.querySelector("defly-wallet-connect-modal")
    ?.shadowRoot?.querySelector(`.${DEFLY_WALLET_MODAL_CLASSNAME}`);

  const closeButton = deflyWalletConnectModal
    ?.querySelector("defly-wallet-modal-header")
    ?.shadowRoot?.getElementById("defly-wallet-modal-header-close-button");

  closeButton?.addEventListener("click", () => {
    onClose();

    removeModalWrapperFromDOM(DEFLY_WALLET_CONNECT_MODAL_ID);
  });
}

/**
 * Creates a DeflyWalletRedirectModal instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openDeflyWalletRedirectModal() {
  const root = createModalWrapperOnDOM(DEFLY_WALLET_REDIRECT_MODAL_ID);

  root.innerHTML = '<defly-wallet-redirect-modal></defly-wallet-redirect-modal>';
}

function openDeflyWalletSignTxnModal() {
  const root = createModalWrapperOnDOM(DEFLY_WALLET_SIGN_TXN_MODAL_ID);

  root.innerHTML = '<defly-wallet-sign-txn-modal></defly-wallet-sign-txn-modal>';

  const signTxnModal = root.querySelector('defly-wallet-sign-txn-modal');

  return signTxnModal
    ? waitForElementCreatedAtShadowDOM(
      signTxnModal,
      'defly-wallet-sign-txn-modal__body__content'
    )
    : Promise.reject();
}

function closeDeflyWalletSignTxnModal(rejectPromise?: (error: any) => void) {
  removeModalWrapperFromDOM(DEFLY_WALLET_SIGN_TXN_MODAL_ID);

  if (rejectPromise) {
    rejectPromise(
      new DeflyWalletConnectError(
        {
          type: 'SIGN_TXN_CANCELLED'
        },
        'Transaction sign is cancelled'
      )
    );
  }
}

/**
 * Creates a DeflyWalletSignTxnToast instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openDeflyWalletSignTxnToast() {
  const root = createModalWrapperOnDOM(DEFLY_WALLET_SIGN_TXN_TOAST_ID);

  root.innerHTML = '<defly-wallet-sign-txn-toast></defly-wallet-sign-txn-toast>';
}

function closeDeflyWalletSignTxnToast() {
  removeModalWrapperFromDOM(DEFLY_WALLET_SIGN_TXN_TOAST_ID);
}

function removeModalWrapperFromDOM(modalId: string) {
  const wrapper = document.getElementById(modalId);

  if (wrapper) {
    wrapper.remove();
  }
}

export {
  DEFLY_WALLET_CONNECT_MODAL_ID,
  DEFLY_WALLET_REDIRECT_MODAL_ID,
  DEFLY_WALLET_SIGN_TXN_TOAST_ID,
  DEFLY_WALLET_SIGN_TXN_MODAL_ID,
  DEFLY_WALLET_MODAL_CLASSNAME,
  openDeflyWalletConnectModal,
  setupDeflyWalletConnectModalCloseListener,
  openDeflyWalletRedirectModal,
  openDeflyWalletSignTxnToast,
  closeDeflyWalletSignTxnToast,
  removeModalWrapperFromDOM,
  openDeflyWalletSignTxnModal,
  closeDeflyWalletSignTxnModal
};
