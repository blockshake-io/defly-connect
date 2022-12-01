import {DeflyWalletModalHeader} from "./modal/header/DeflyWalletModalHeader";
import {DeflyWalletModalDesktopMode} from "./modal/mode/desktop/DeflyWalletConnectModalDesktopMode";
import {DeflyWalletModalTouchScreenMode} from "./modal/mode/touch-screen/DeflyWalletModalTouchScreenMode";
import {DeflyWalletConnectModal} from "./modal/DeflyWalletConnectModal";
import {DeflyWalletRedirectModal} from "./modal/redirect/DeflyWalletRedirectModal";
import {DeflyWalletConnectModalInformationSection} from "./modal/section/information/DeflyWalletConnectModalInformationSection";
import {DeflyWalletConnectModalPendingMessageSection} from "./modal/section/pending-message/DeflyWalletConnectModalPendingMessage";
import {DeflyWalletSignTxnToast} from "./modal/sign-toast/DeflyWalletSignTxnToast";
import {DeflyWalletSignTxnModal} from "./modal/sign-txn/DeflyWalletSignTxnModal";

import "./util/screen/setDynamicVhValue";

window.customElements.define("defly-wallet-connect-modal", DeflyWalletConnectModal);
window.customElements.define(
  "defly-wallet-modal-desktop-mode",
  DeflyWalletModalDesktopMode
);
window.customElements.define("defly-wallet-modal-header", DeflyWalletModalHeader);
window.customElements.define(
  "defly-wallet-modal-touch-screen-mode",
  DeflyWalletModalTouchScreenMode
);
window.customElements.define("defly-wallet-redirect-modal", DeflyWalletRedirectModal);
window.customElements.define(
  "defly-wallet-connect-modal-information-section",
  DeflyWalletConnectModalInformationSection
);
window.customElements.define(
  "defly-wallet-connect-modal-pending-message-section",
  DeflyWalletConnectModalPendingMessageSection
);
window.customElements.define("defly-wallet-sign-txn-toast", DeflyWalletSignTxnToast);
window.customElements.define("defly-wallet-sign-txn-modal", DeflyWalletSignTxnModal);
