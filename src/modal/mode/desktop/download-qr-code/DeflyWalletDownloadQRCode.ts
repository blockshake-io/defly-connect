import DeflyWalletLogoWithBlackBackground from "../../../../asset/icon/DeflyWalletWithBlackBackground.svg";

import QRCodeStyling from "qr-code-styling";

import styles from "./_defly-wallet-download-qr-code.scss";
import {DEFLY_DOWNLOAD_URL} from "../../../../util/deflyWalletConstants";

const deflyWalletDownloadQRCode = document.createElement("template");

deflyWalletDownloadQRCode.innerHTML = `
  <div id="defly-wallet-download-qr-code-wrapper" class="defly-wallet-download-qr-code-wrapper"></div>  
`;

export class DeflyWalletDownloadQRCode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        deflyWalletDownloadQRCode.content.cloneNode(true),
        styleSheet
      );
    }
  }

  connectedCallback() {
    const downloadQRCode = new QRCodeStyling({
      width: 250,
      height: 250,
      type: "svg",
      data: DEFLY_DOWNLOAD_URL,
      image: DeflyWalletLogoWithBlackBackground,
      dotsOptions: {
        color: "#000",
        type: "dots"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
      },
      cornersSquareOptions: {type: "extra-rounded"},
      cornersDotOptions: {
        type: "dot"
      }
    });
    const downloadQRCodeWrapper = this.shadowRoot?.getElementById(
      "defly-wallet-download-qr-code-wrapper"
    );

    if (downloadQRCodeWrapper) {
      downloadQRCode.append(downloadQRCodeWrapper);
    }
  }
}
