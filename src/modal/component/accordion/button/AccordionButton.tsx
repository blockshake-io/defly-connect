import "./_accordion-button.scss";

import React from "react";

import AccordionIcon from "../icon/AccordionIcon";

interface AccordionButtonProps {
  linkData: {text: string, link: string};
  children: React.ReactNode;
  onClick: VoidFunction;
}

function AccordionButton({linkData, children, onClick}: AccordionButtonProps) {
  return (
    <button className={"defly-wallet-accordion-button"} onClick={onClick}>
      <AccordionIcon />

      <p>{children} <a href={linkData.link}>{linkData.text}</a></p>
    </button>
  );
}

export default AccordionButton;
