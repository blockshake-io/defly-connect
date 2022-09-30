import "./_accordion-panel.scss";

import React from "react";

import { copyToClipboard } from '../../../../util/copy/copyUtils';

interface AccordionPanelProps {
  code: string;
  children: React.ReactNode;
}

function AccordionPanel({children, code}: AccordionPanelProps) {
  return (
    <div className={"defly-wallet-accordion-panel"}>
      <div className={"defly-wallet-accordion-panel__description"} onClick={handleClipboardCopy}>{children}</div>
    </div>
  );

  function handleClipboardCopy() {
    copyToClipboard(code);
  }
}

export default AccordionPanel;
