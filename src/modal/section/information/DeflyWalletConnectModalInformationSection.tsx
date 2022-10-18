import DeflyWallet from "../../../asset/icon/DeflyWallet.svg";

import "./_defly-wallet-modal-information-section.scss";

import React from "react";

import {useIsSmallScreen} from "../../../util/screen/useMediaQuery";
import {getDeflyWalletAppMeta} from "../../../util/deflyWalletUtils";

function DeflyWalletConnectModalInformationSection() {
  const isSmallScreen = useIsSmallScreen();
  const {logo} = getDeflyWalletAppMeta();

  return (
    <section className={"defly-wallet-connect-modal-information-section"}>
      <img
        className={"defly-wallet-connect-modal-information-section__defly-icon"}
        src={isSmallScreen ? logo : DeflyWallet}
        alt={"Defly Wallet Logo"}
      />

      <h1 className={"defly-wallet-connect-modal-information-section__title"}>
        {"Secure \n wallet & \n trading"}
      </h1>
    </section>
  );
}

export default DeflyWalletConnectModalInformationSection;
