import DeflyWalletLogoCircleBlack from "../asset/icon/DeflyWallet--circle-black.svg";

import React from "react";
import ReactDOM from "react-dom/client";
import {QRCode} from "react-qrcode-logo";

import {AccordionData} from "./component/accordion/util/accordionTypes";
import DeflyWalletConnectError from "../util/DeflyWalletConnectError";
import DeflyWalletConnectModal from "./DeflyWalletConnectModal";
import DeflyWalletRedirectModal from "./redirect/DeflyWalletRedirectModal";
import DeflyWalletSignTxnToast from "./sign-toast/DeflyWalletSignTxnToast";

// The ID of the wrapper element for DeflyWalletConnectModal
const DEFLY_WALLET_CONNECT_MODAL_ID = "defly-wallet-connect-modal-wrapper";

// The ID of the wrapper element for DeflyWalletRedirectModal
const DEFLY_WALLET_REDIRECT_MODAL_ID = "defly-wallet-redirect-modal-wrapper";

// The ID of the wrapper element for DeflyWalletSignTxnToast
const DEFLY_WALLET_SIGN_TXN_TOAST_ID = "defly-wallet-sign-txn-toast-wrapper";

/**
 * @returns {HTMLDivElement} wrapper element for DeflyWalletConnectModal
 */
function createModalWrapperOnDOM(modalId: string) {
  const wrapper = document.createElement("div");

  wrapper.setAttribute("id", modalId);

  document.body.appendChild(wrapper);

  return wrapper;
}

/**
 * Creates a DeflyWalletConnectModal instance and renders it on the DOM.
 *
 * @param {rejectPromise} rejectPromise - the reject callback of the DeflyWalletConnect.connect method
 * @param {string} uri - uri to be passed to Defly Wallet via deeplink
 * @param {VoidFunction} closeCallback - callback to be called when user closes the modal
 * @returns {void}
 */
function openDeflyWalletConnectModal(rejectPromise?: (error: any) => void) {
  return (uri: string, closeCallback: VoidFunction) => {
    const root = ReactDOM.createRoot(
      createModalWrapperOnDOM(DEFLY_WALLET_CONNECT_MODAL_ID)
    );

    root.render(
      <DeflyWalletConnectModal onClose={handleCloseDeflyWalletConnectModal} uri={uri} />
    );

    function handleCloseDeflyWalletConnectModal() {
      removeModalWrapperFromDOM(DEFLY_WALLET_CONNECT_MODAL_ID);
      closeCallback();

      if (rejectPromise) {
        rejectPromise(
          new DeflyWalletConnectError(
            {
              type: "CONNECT_MODAL_CLOSED"
            },
            "The modal has been closed by the user."
          )
        );
      }
    }
  };
}

/**
 * Creates a DeflyWalletRedirectModal instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openDeflyWalletRedirectModal() {
  const root = ReactDOM.createRoot(
    createModalWrapperOnDOM(DEFLY_WALLET_REDIRECT_MODAL_ID)
  );

  root.render(<DeflyWalletRedirectModal onClose={handleCloseDeflyWalletRedirectModal} />);

  function handleCloseDeflyWalletRedirectModal() {
    removeModalWrapperFromDOM(DEFLY_WALLET_REDIRECT_MODAL_ID);
  }
}

/**
 * Creates a DeflyWalletSignTxnToast instance and renders it on the DOM.
 *
 * @returns {void}
 */
function openDeflyWalletSignTxnToast() {
  const root = ReactDOM.createRoot(
    createModalWrapperOnDOM(DEFLY_WALLET_SIGN_TXN_TOAST_ID)
  );

  root.render(<DeflyWalletSignTxnToast onClose={closeDeflyWalletSignTxnToast} />);
}

function closeDeflyWalletSignTxnToast() {
  removeModalWrapperFromDOM(DEFLY_WALLET_SIGN_TXN_TOAST_ID);
}

/**
 * Removes the DeflyWalletConnectModal from the DOM.
 * @returns {void}
 */
function removeModalWrapperFromDOM(modalId: string) {
  const wrapper = document.getElementById(modalId);

  if (wrapper) {
    wrapper.remove();
  }
}

function getDeflyConnectModalAccordionData(uri: string): AccordionData[] {
  return [
    {
      id: "scan-to-connect",
      title: "Scan with Defly Wallet to connect",
      description: (
        <QRCode
          id={"defly-wallet-connect-modal-desktop-mode__qr-code"}
          logoImage={DeflyWalletLogoCircleBlack}
          value={uri}
          qrStyle={"dots"}
          quietZone={20}
          logoWidth={70}
          logoHeight={70}
          // eslint-disable no-magic-numbers
          eyeRadius={5}
          size={330}
        />
      )
    },
  ];
}

export {getDeflyConnectModalAccordionData};

export {
  DEFLY_WALLET_CONNECT_MODAL_ID,
  DEFLY_WALLET_REDIRECT_MODAL_ID,
  DEFLY_WALLET_SIGN_TXN_TOAST_ID,
  openDeflyWalletConnectModal,
  openDeflyWalletRedirectModal,
  openDeflyWalletSignTxnToast,
  closeDeflyWalletSignTxnToast,
  removeModalWrapperFromDOM
};
