import "./_accordion-copy-button.scss";

import React from "react";

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
    copyToClipboard(children as string);
  }
}

export default AccordionCopyButton;
