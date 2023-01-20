import DeflyConnectIcon from "../../asset/icon/DeflyConnect.svg";
import CloseIcon from "../../asset/icon/Close.svg";
import CloseIconLight from "../../asset/icon/Close--light.svg";

import styles from "./_defly-wallet-modal-header.scss";
import {isSmallScreen} from "../../util/screen/screenSizeUtils";
import {isMobile} from "../../util/device/deviceUtils";
import {
  DEFLY_WALLET_REDIRECT_MODAL_ID,
  removeModalWrapperFromDOM
} from "../deflyWalletConnectModalUtils";

const deflyWalletModalHeader = document.createElement("template");

const headerClassName = isMobile()
  ? "defly-wallet-modal-header defly-wallet-modal-header--mobile"
  : "defly-wallet-modal-header defly-wallet-modal-header--desktop";

deflyWalletModalHeader.innerHTML = `
  <div class="${headerClassName}">
      ${
        isSmallScreen() && isMobile()
          ? ""
          : `<div class="defly-wallet-modal-header__brand">
              <img src="${DeflyConnectIcon}" />

              Defly Connect
            </div>
            `
      } 

      <button
        id="defly-wallet-modal-header-close-button"
        class="defly-wallet-button defly-wallet-modal-header__close-button">
        <img
          class="defly-wallet-modal-header__close-button__close-icon"
          src="${isSmallScreen() && isMobile() ? CloseIconLight : CloseIcon}"
        />
      </button>
    </div>
`;

export class DeflyWalletModalHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(deflyWalletModalHeader.content.cloneNode(true), styleSheet);
      this.onClose();
    }
  }
  onClose() {
    const closeButton = this.shadowRoot?.getElementById(
      "defly-wallet-modal-header-close-button"
    );
    const modalId = this.getAttribute("modal-id");

    if (closeButton && modalId === DEFLY_WALLET_REDIRECT_MODAL_ID) {
      closeButton.addEventListener("click", () => {
        removeModalWrapperFromDOM(DEFLY_WALLET_REDIRECT_MODAL_ID);
      });
    }
  }
}
