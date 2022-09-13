import "./_defly-wallet-connect-modal-pending-message.scss";

import React from "react";

import {getDeflyWalletAppMeta} from "../../../util/deflyWalletUtils";

interface DeflyWalletConnectModalPendingMessageProps {
  onClose: () => void;
}

function DeflyWalletConnectModalPendingMessage({
  onClose
}: DeflyWalletConnectModalPendingMessageProps) {
  const {logo, name} = getDeflyWalletAppMeta();

  return (
    <>
      <div className={"defly-wallet-connect-modal-pending-message"}>
        <img src={logo} alt={"Defly Wallet Logo"} />

        <div className={"defly-wallet-connect-modal-pending-message__text"}>
          {`Please wait while we connect you to`}

          <b>{` ${name}...`}</b>
        </div>
      </div>

      <button
        className={
          "defly-wallet-connect-button defly-wallet-connect-modal-pending-message__cancel-button"
        }
        onClick={handleCancelClick}>
        {"Cancel"}
      </button>
    </>
  );

  function handleCancelClick() {
    onClose();
  }
}

export default DeflyWalletConnectModalPendingMessage;
