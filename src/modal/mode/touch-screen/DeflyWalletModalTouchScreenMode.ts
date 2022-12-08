import {
  generateDeflyWalletConnectDeepLink,
  getDeflyWalletAppMeta
} from "../../../util/deflyWalletUtils";
import styles from "./_defly-wallet-modal-touch-screen-mode.scss";

const deflyWalletModalTouchScreenMode = document.createElement("template");
const {name} = getDeflyWalletAppMeta();

const touchScreenDefaultMode = `
  <div class="defly-wallet-connect-modal-touch-screen-mode">
    <defly-wallet-connect-modal-information-section></defly-wallet-connect-modal-information-section>

    <div>
      <a
        id="defly-wallet-connect-modal-touch-screen-mode-launch-defly-wallet-button"
        class="defly-wallet-connect-modal-touch-screen-mode__launch-defly-wallet-button"
        rel="noopener noreferrer"
        target="_blank">
        Launch ${name}
      </a>

      <div
        class="defly-wallet-connect-modal-touch-screen-mode__new-to-defly-box">
        <p class="defly-wallet-connect-modal-touch-screen-mode__new-to-defly-box__text">
          New to <a href="https://defly.app/">Defly Wallet</a>?
        </p>
      </div>

      <a
        href="https://defly.app/download.html"
        class="defly-wallet-connect-modal-touch-screen-mode__install-defly-wallet-button"
        rel="noopener noreferrer"
        target="_blank">
        Install ${name}
      </a>
    </div>
  </div>
`;

export class DeflyWalletModalTouchScreenMode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});

    deflyWalletModalTouchScreenMode.innerHTML = touchScreenDefaultMode;

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.append(
        deflyWalletModalTouchScreenMode.content.cloneNode(true),
        styleSheet
      );

      const launchDeflyLink = this.shadowRoot?.getElementById(
        "defly-wallet-connect-modal-touch-screen-mode-launch-defly-wallet-button"
      );
      const URI = this.getAttribute("uri");

      if (launchDeflyLink && URI) {
        launchDeflyLink.setAttribute("href", generateDeflyWalletConnectDeepLink(URI));
        launchDeflyLink.addEventListener("click", () => {
          this.onClickLaunch();
        });
      }
    }
  }

  onClickLaunch() {
    deflyWalletModalTouchScreenMode.innerHTML = `
    <div class="defly-wallet-connect-modal-touch-screen-mode defly-wallet-connect-modal-touch-screen-mode--pending-message-view">
      <defly-wallet-connect-modal-pending-message-section should-use-sound="${this.getAttribute(
        "should-use-sound"
      )}"></defly-wallet-connect-modal-pending-message-section>
    </div>
  `;

    if (this.shadowRoot) {
      const styleSheet = document.createElement("style");

      styleSheet.textContent = styles;

      this.shadowRoot.innerHTML = "";

      this.shadowRoot.append(
        deflyWalletModalTouchScreenMode.content.cloneNode(true),
        styleSheet
      );
    }
  }
}
