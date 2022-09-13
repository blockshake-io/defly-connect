import CloseIcon from "../asset/icon/Close.svg";
import CloseIconLight from "../asset/icon/Close--light.svg";

import "./_defly-wallet-modal.scss";

import React from "react";

import {useIsSmallScreen} from "../util/screen/useMediaQuery";
import DeflyWalletConnectModalTouchScreenMode from "./mode/touch-screen/DeflyWalletConnectModalTouchScreenMode";
import DeflyWalletConnectModalDesktopMode from "./mode/desktop/DeflyWalletConnectModalDesktopMode";
import useSetDynamicVhValue from "../util/screen/useSetDynamicVhValue";

interface DeflyWalletConnectModalProps {
  uri: string;
  onClose: () => void;
}

function DeflyWalletConnectModal({uri, onClose}: DeflyWalletConnectModalProps) {
  const isSmallScreen = useIsSmallScreen();

  useSetDynamicVhValue();

  return (
    <div className={"defly-wallet-connect-modal"}>
      <div className={"defly-wallet-connect-modal__body"}>
        <div className={"defly-wallet-connect-modal__body__header"}>
          <button
            className={
              "defly-wallet-connect-button defly-wallet-connect-modal__close-button"
            }
            onClick={onClose}>
            <img src={isSmallScreen ? CloseIconLight : CloseIcon} />
          </button>
        </div>

        {isSmallScreen ? (
          <DeflyWalletConnectModalTouchScreenMode uri={uri} />
        ) : (
          <DeflyWalletConnectModalDesktopMode uri={uri} />
        )}
      </div>
    </div>
  );
}

export default DeflyWalletConnectModal;
