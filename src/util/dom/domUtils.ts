function waitForElementCreatedAtShadowDOM(
  element: Element,
  className: string
): Promise<Element> {
  // eslint-disable-next-line consistent-return
  return new Promise<Element>((resolve) => {
    const waitedElement = element.shadowRoot?.querySelector(`.${className}`);

    if (waitedElement) {
      return resolve(waitedElement);
    }

    const observer = new MutationObserver(() => {
      if (waitedElement) {
        resolve(waitedElement);
        observer.disconnect();
      }
    });

    observer.observe(element, {
      childList: true,
      subtree: true
    });
  });
}

export { waitForElementCreatedAtShadowDOM };
