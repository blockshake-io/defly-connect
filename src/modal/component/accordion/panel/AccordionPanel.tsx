import "./_accordion-panel.scss";

import React from "react";

interface AccordionPanelProps {
  children: React.ReactNode;
}

function AccordionPanel({children}: AccordionPanelProps) {
  return (
    <div className={"defly-wallet-accordion-panel"}>
      <div className={"defly-wallet-accordion-panel__description"}>{children}</div>
    </div>
  );
}

export default AccordionPanel;
