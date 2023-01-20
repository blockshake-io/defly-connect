import QrIcon from '../../../asset/icon/Qr.svg';
import DeflyWalletLogo from "../../../asset/icon/DeflyWallet.svg";

import styles from "./_defly-wallet-connect-modal-information-section.scss";
import {isMobile} from "../../../util/device/deviceUtils";


const deflyWalletConnectModalInformationSectionTemplate = document.createElement("template");
const informationSectionClassNames = isMobile()
  ? "defly-wallet-connect-modal-information-section defly-wallet-connect-modal-information-section--mobile"
  : "defly-wallet-connect-modal-information-section defly-wallet-connect-modal-information-section--desktop";

deflyWalletConnectModalInformationSectionTemplate.innerHTML = `
  <section class="${informationSectionClassNames}">
    <img src="${DeflyWalletLogo}" class="defly-wallet-connect-modal-information-section__defly-icon" alt="Defly Wallet" />
    <h1 class="defly-wallet-connect-modal-information-section__title">${"Secure \n wallet & \n trading"}</h1>
 
    <button
        id="defly-wallet-connect-modal-information-section-download-defly-button"
        class="defly-wallet-connect-modal-information-section__download-defly-button">
        <img src="${QrIcon}" alt="QR Icon" />
        Download
      </button>
  </section>
`;

export class DeflyWalletConnectModalInformationSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        deflyWalletConnectModalInformationSectionTemplate.content.cloneNode(true),
        styleSheet
      );

      const downloadDeflyButton = this.shadowRoot?.getElementById(
        'defly-wallet-connect-modal-information-section-download-defly-button'
      );

      if (downloadDeflyButton) {
        downloadDeflyButton.addEventListener('click', () => {
          this.onClickDownload();
        });
      }
    }

  }

  onClickDownload() {
    if (this.shadowRoot) {
      const modalDesktopMode = this.shadowRoot.host.parentElement

      if (modalDesktopMode) {
        modalDesktopMode.classList.remove(
          'defly-wallet-connect-modal-desktop-mode--default'
        );

        modalDesktopMode.classList.add(
          'defly-wallet-connect-modal-desktop-mode--download'
        );
      }
    }
  }
}
