import {
  DEFLY_WALLET_MODAL_CLASSNAME,
  DEFLY_WALLET_SIGN_TXN_MODAL_ID
} from "../deflyWalletConnectModalUtils";
import styles from "./_defly-wallet-sign-txn-modal.scss";

const deflyWalletSignTxnModal = document.createElement("template");

deflyWalletSignTxnModal.innerHTML = `
  <div class="${DEFLY_WALLET_MODAL_CLASSNAME} defly-wallet-sign-txn-modal">
    <div class="defly-wallet-modal__body">
      <defly-wallet-modal-header modal-id="${DEFLY_WALLET_SIGN_TXN_MODAL_ID}"></defly-wallet-modal-header/>

      <div class="defly-wallet-sign-txn-modal__body__content" />
    </div>
  </div>
`;

export class DeflyWalletSignTxnModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(deflyWalletSignTxnModal.content.cloneNode(true), styleSheet);
    }
  }
}
