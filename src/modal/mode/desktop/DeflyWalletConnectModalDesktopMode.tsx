import "./_defly-wallet-connect-modal-desktop-mode.scss";

import React from "react";

import Accordion from "../../component/accordion/Accordion";
import {getDeflyConnectModalAccordionData} from "../../deflyWalletConnectModalUtils";
import DeflyWalletConnectModalInformationSection from "../../section/information/DeflyWalletConnectModalInformationSection";

interface DeflyWalletConnectModalDesktopModeProps {
  uri: string;
}

function DeflyWalletConnectModalDesktopMode({
  uri
}: DeflyWalletConnectModalDesktopModeProps) {
  return (
    <div className={"defly-wallet-connect-modal-desktop-mode"}>
      <DeflyWalletConnectModalInformationSection />

      <Accordion items={getDeflyConnectModalAccordionData(uri)} />
    </div>
  );
}

export default DeflyWalletConnectModalDesktopMode;
