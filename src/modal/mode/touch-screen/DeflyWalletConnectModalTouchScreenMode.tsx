import "./_defly-wallet-connect-modal-touch-screen-mode.scss";

import React, {useState} from "react";

import {
  generateDeflyWalletConnectDeepLink,
  getDeflyWalletAppMeta
} from "../../../util/deflyWalletUtils";
import DeflyWalletConnectModalInformationSection from "../../section/information/DeflyWalletConnectModalInformationSection";
import DeflyWalletConnectModalPendingMessage from "../../section/pending-message/DeflyWalletConnectModalPendingMessage";

interface DeflyWalletConnectModalTouchScreenModeProps {
  uri: string;
}
function DeflyWalletConnectModalTouchScreenMode({
  uri
}: DeflyWalletConnectModalTouchScreenModeProps) {
  const [view, setView] = useState("default" as "default" | "launching-app");
  const {name} = getDeflyWalletAppMeta();

  return (
    <div
      className={`defly-wallet-connect-modal-touch-screen-mode ${
        view === "launching-app"
          ? "defly-wallet-connect-modal-touch-screen-mode--pending-message-view"
          : ""
      }`}>
      {view === "launching-app" ? (
        <DeflyWalletConnectModalPendingMessage onClose={handleChangeModalView} />
      ) : (
        <>
          <DeflyWalletConnectModalInformationSection />

          <div>
            <a
              onClick={handleChangeModalView}
              className={
                "defly-wallet-connect-modal-touch-screen-mode__launch-defly-wallet-button"
              }
              href={generateDeflyWalletConnectDeepLink(uri)}
              rel={"noopener noreferrer"}
              target={"_blank"}>
              {`Launch ${name}`}
            </a>

            <div
              className={"defly-wallet-connect-modal-touch-screen-mode__new-to-defly-box"}>
              <p
                className={
                  "defly-wallet-connect-modal-touch-screen-mode__new-to-defly-box__text"
                }>
                {"New to "}<a href={`https://defly.app/`}>{`Defly Algorand Wallet`}</a>{"?"}
              </p>
            </div>

            <a
              href={"https://defly.app/download.html"}
              className={
                "defly-wallet-connect-modal-touch-screen-mode__install-defly-wallet-button"
              }
              rel={"noopener noreferrer"}
              target={"_blank"}>
              {`Install ${name}`}
            </a>
          </div>
        </>
      )}
    </div>
  );

  function handleChangeModalView() {
    if (view === "default") {
      setView("launching-app");
    } else if (view === "launching-app") {
      setView("default");
    }
  }
}

export default DeflyWalletConnectModalTouchScreenMode;
