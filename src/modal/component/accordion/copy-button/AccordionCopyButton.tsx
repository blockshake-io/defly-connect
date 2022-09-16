import "./_accordion-copy-button.scss";

import React from "react";

import { generateDeflyWalletConnectDeepLink } from '../../../../util/deflyWalletUtils';
import { copyToClipboard } from '../../../../util/copy/copyUtils';

interface AccordionCopyButtonProps {
  children: React.ReactNode;
}

function AccordionCopyButton({children}: AccordionCopyButtonProps) {
  return (
    <div className={"defly-wallet-accordion-copy-button"} onClick={handleClipboardCopy}>
      {'Tap to copy'}
    </div>
  );

  function handleClipboardCopy() {
    copyToClipboard(generateDeflyWalletConnectDeepLink(children as string));
  }
}

export default AccordionCopyButton;
