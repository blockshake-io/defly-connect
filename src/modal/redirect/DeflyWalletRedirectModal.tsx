import DeflyRedirectIcon from "../../asset/icon/DeflyRedirectIcon.svg";

import "../_defly-wallet-modal.scss";
import "./_defly-wallet-redirect-modal.scss";

import React from "react";

import {
  generateDeflyWalletAppDeepLink,
  getDeflyWalletAppMeta
} from "../../util/deflyWalletUtils";
import useSetDynamicVhValue from "../../util/screen/useSetDynamicVhValue";

interface DeflyWalletRedirectModalProps {
  onClose: () => void;
}

function DeflyWalletRedirectModal({onClose}: DeflyWalletRedirectModalProps) {
  const {name, main_color} = getDeflyWalletAppMeta();

  useSetDynamicVhValue();

  return (
    <div
      className={"defly-wallet-connect-modal"}
      style={{"--defly-wallet-main-color": main_color} as React.CSSProperties}>
      <div className={"defly-wallet-connect-modal__body"}>
        <div className={"defly-wallet-wallet-redirect-modal"}>
          <div className={"defly-wallet-redirect-modal__content"}>
            <img src={DeflyRedirectIcon} />

            <h1 className={"defly-wallet-redirect-modal__content__title"}>
              {"Continue on Defly"}
            </h1>

            <p className={"defly-wallet-redirect-modal__content__description"}>
              {
                "Launch Defly Wallet to securely connect your account and sign transactions."
              }
            </p>

            <p className={"defly-wallet-redirect-modal__content__install-defly-text"}>
              {"Don't have Defly Wallet installed yet?"}

              <br />

              <a
                onClick={handleCloseRedirectModal}
                className={"defly-wallet-redirect-modal__content__install-defly-text__link"}
                href={"https://defly.app/download.html"}
                rel={"noopener noreferrer"}
                target={"_blank"}>
                {"Tap here to install."}
              </a>
            </p>
          </div>

          <a
            onClick={handleCloseRedirectModal}
            className={"defly-wallet-redirect-modal__launch-defly-wallet-button"}
            href={generateDeflyWalletAppDeepLink()}
            rel={"noopener noreferrer"}
            target={"_blank"}>
            {`Launch ${name}`}
          </a>
        </div>
      </div>
    </div>
  );

  function handleCloseRedirectModal() {
    onClose();
  }
}

export default DeflyWalletRedirectModal;
