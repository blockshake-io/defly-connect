import DeflyRedirectIcon from "../../asset/icon/DeflyRedirectIcon.svg";

import {generateDeflyWalletAppDeepLink} from "../../util/deflyWalletUtils";
import {
  DEFLY_WALLET_REDIRECT_MODAL_ID,
  removeModalWrapperFromDOM
} from "../deflyWalletConnectModalUtils";
import styles from "./_defly-wallet-redirect-modal.scss";

const deflyWalletRedirectModalTemplate = document.createElement("template");

deflyWalletRedirectModalTemplate.innerHTML = `
  <div class="defly-wallet-modal defly-wallet-modal--mobile">
    <div class="defly-wallet-modal__body">
    <defly-wallet-modal-header modal-id="${DEFLY_WALLET_REDIRECT_MODAL_ID}"></pera-wallet-modal-header/>
      <div class="defly-wallet-redirect-modal">
        <div class="defly-wallet-redirect-modal__content">
          <img src="${DeflyRedirectIcon}" />

          <h1 class="defly-wallet-redirect-modal__content__title">
            Can't Launch Defly
          </h1>

          <p class="defly-wallet-redirect-modal__content__description">
            We couldn't redirect you to Defly Wallet automatically. Please try again.
          </p>

          <p class="defly-wallet-redirect-modal__content__install-defly-text">
            Don't have Defly Wallet installed yet?
            <br />
            
            <a
              id="defly-wallet-redirect-modal-download-defly-link"
              class="defly-wallet-redirect-modal__content__install-defly-text__link"
              href="https://deflywallet.app/download/"
              rel="noopener noreferrer"
              target="_blank">
              Tap here to install.
            </a>
          </p>
        </div>

        <a
          id="defly-wallet-redirect-modal-launch-defly-link"
          class="defly-wallet-redirect-modal__launch-defly-wallet-button"
          rel="noopener noreferrer"
          target="_blank">
          Launch Defly Wallet
        </a>
      </div>
    </div>
  </div>
`;

export class DeflyWalletRedirectModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        deflyWalletRedirectModalTemplate.content.cloneNode(true),
        styleSheet
      );

      const downloadDeflyLink = this.shadowRoot?.getElementById(
        "defly-wallet-redirect-modal-download-defly-link"
      );

      downloadDeflyLink?.addEventListener("click", () => {
        this.onClose();
      });

      const launchDeflyLink = this.shadowRoot?.getElementById(
        "defly-wallet-redirect-modal-launch-defly-link"
      );

      launchDeflyLink?.addEventListener("click", () => {
        this.onClose();
        window.open(generateDeflyWalletAppDeepLink(), "_blank");
      });
    }
  }

  connectedCallback() {
    const deflyWalletDeepLink = window.open(generateDeflyWalletAppDeepLink(), "_blank");

    if (deflyWalletDeepLink && !deflyWalletDeepLink.closed) {
      this.onClose();
    }

  }

  onClose() {
    removeModalWrapperFromDOM(DEFLY_WALLET_REDIRECT_MODAL_ID);
  }
}
