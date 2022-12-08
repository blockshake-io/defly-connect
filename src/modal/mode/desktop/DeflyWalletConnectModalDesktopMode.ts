
import ArrowLeft from '../../../asset/icon/Left.svg';
import AppStoreIcon from '../../../asset/icon/AppStoreIcon.svg';
import PlayStoreIcon from '../../../asset/icon/PlayStoreIcon.svg';
import DeflyWalletLogoWithBlackBackground from '../../../asset/icon/DeflyWalletWithBlackBackground.svg';

import QRCodeStyling from 'qr-code-styling';

import styles from './_defly-wallet-connect-modal-desktop-mode.scss';
import accordionStyles from './accordion/_defly-wallet-accordion.scss';

const deflyWalletConnectModalDesktopMode = document.createElement('template');
const styleSheet = document.createElement('style');
const accordionStyleSheet = document.createElement('style');

styleSheet.textContent = styles;
accordionStyleSheet.textContent = accordionStyles;

const deflyWalletConnectModalDesktopModeDefaultView = `
  <div id="defly-wallet-connect-modal-desktop-mode" class="defly-wallet-connect-modal-desktop-mode defly-wallet-connect-modal-desktop-mode--default">
      <defly-wallet-connect-modal-information-section></defly-wallet-connect-modal-information-section>

      <div class="defly-wallet-connect-modal-desktop-mode__default-view">

        <div class="defly-wallet-accordion-item defly-wallet-accordion-item--active">

          <div class="defly-wallet-accordion-item__content">
            <div id="defly-wallet-connect-modal-connect-qr-code" class="defly-wallet-connect-qr-code-wrapper f_copy-button"></div>

            <div class="defly-wallet-accordion-copy-button f_copy-button">Tap to copy</div>
            <p class="defly-wallet-connect-modal-desktop-mode__scan-defly-description">
                Scan with <a href="https://defly.app/">Defly Wallet</a>
            </p>

            
          </div>
        </div>
      </div>

      <div class="defly-wallet-connect-modal-desktop-mode__download-view">
        <button id="defly-wallet-connect-modal-download-defly-view-back-button" class="defly-wallet-connect-modal-download-defly-view__back-button">
          <img src="${ArrowLeft}" alt="Back Arrow" /> Back
        </button>

        <div class="defly-wallet-connect-modal-download-defly-view">
          <h1 class="defly-wallet-connect-modal-download-defly-view__title">
            Download Defly Wallet
          </h1>

          <defly-wallet-download-qr-code></defly-wallet-download-qr-code>

          <div class="defly-wallet-connect-modal-download-defly-view__footer">
            <a
              href="https://apps.apple.com/us/app/defly/id1602672723"
              target="_blank"
              rel="noopener noreferrer">
              <img src="${AppStoreIcon}" alt="App Store icon" />
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=io.blockshake.defly.app"
              target="_blank"
              rel="noopener noreferrer">
              <img src="${PlayStoreIcon}" alt="Play Store icon" />
            </a>

          </div>
        </div>
      </div>
    </div>
  `;

deflyWalletConnectModalDesktopMode.innerHTML =
  deflyWalletConnectModalDesktopModeDefaultView;

export class DeflyWalletModalDesktopMode extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    if (this.shadowRoot) {
      this.shadowRoot.append(
        deflyWalletConnectModalDesktopMode.content.cloneNode(true),
        styleSheet,
        accordionStyleSheet
      );

      this.shadowRoot.addEventListener('click', (event) => {
        this.handleAccordion(event as MouseEvent);
      });
    }
  }

  connectedCallback() {
    this.handleChangeView();
  }

  handleChangeView() {
    const downloadDeflyButton = this.shadowRoot?.getElementById(
      'defly-wallet-connect-modal-desktop-mode-download-defly-button'
    );

    const backButton = this.shadowRoot?.getElementById(
      'defly-wallet-connect-modal-download-defly-view-back-button'
    );

    const copyButtons = this.shadowRoot?.querySelectorAll('.f_copy-button');

    if (downloadDeflyButton) {
      downloadDeflyButton.addEventListener('click', () => {
        this.onClickDownload();
      });
    }

    if (backButton) {
      backButton.addEventListener('click', () => {
        this.onClickBack();
      });
    }

    if (copyButtons && copyButtons.length) {
      copyButtons.forEach((button) => {
        button.addEventListener('click', () => {
          this.onClickCopy();
        });
      });
    }

    this.renderQRCode();
  }

  handleAccordion(event: MouseEvent) {
    if (event.target instanceof Element) {
      if (!event.target.classList.contains('defly-wallet-accordion-toggle__button')) {
        return;
      }

      if (this.shadowRoot && event.target.parentElement?.parentElement) {
        const accordionItem = event.target.parentElement?.parentElement;

        if (!accordionItem) {
          return;
        }

        if (accordionItem.classList.contains('defly-wallet-accordion-item--active')) {
          return;
        }

        const accordionItems = this.shadowRoot.querySelectorAll(
          '.defly-wallet-accordion-item.defly-wallet-accordion-item--active'
        );

        for (let i = 0; i < accordionItems.length; i++) {
          accordionItems[i].classList.remove('defly-wallet-accordion-item--active');
        }

        accordionItem.classList.toggle('defly-wallet-accordion-item--active');
      }
    }
  }

  renderQRCode() {
    const URI = this.getAttribute('uri');

    const size = 330;

    if (URI) {
      const qrCode = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: URI,
        image: DeflyWalletLogoWithBlackBackground,
        dotsOptions: {
          color: '#000',
          type: 'dots'
        },
        imageOptions: {
          imageSize: .21,
          crossOrigin: 'anonymous',
        },
        cornersSquareOptions: { type: 'extra-rounded' },
        cornersDotOptions: {
          type: 'dot'
        }
      });

      const qrWrapper = this.shadowRoot?.getElementById(
        'defly-wallet-connect-modal-connect-qr-code'
      );

      if (qrWrapper) {
        qrCode.append(qrWrapper);
      }
    }
  }

  onClickDownload() {
    if (this.shadowRoot) {
      const modalDesktopMode = this.shadowRoot.getElementById(
        'defly-wallet-connect-modal-desktop-mode'
      );

      if (modalDesktopMode) {
        modalDesktopMode.classList.remove(
          'defly-wallet-connect-modal-desktop-mode--default'
        );

        modalDesktopMode.classList.add(
          'defly-wallet-connect-modal-desktop-mode--download'
        );
      }
    }
  }

  onClickCopy() {
    if (this.shadowRoot) {
      const URI = this.getAttribute('uri');

      if (URI) {
        const textarea = document.createElement('textarea');

        textarea.style.position = 'fixed';
        textarea.style.left = '0';
        textarea.style.top = '0';
        textarea.style.opacity = '0';
        textarea.value = URI;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        /* eslint-disable */
        document.execCommand('copy'); // copy passed value
        /* eslint-enable */
        document.body.removeChild(textarea);
      }
    }
  }

  onClickBack() {
    if (this.shadowRoot) {
      const modalDesktopMode = this.shadowRoot.getElementById(
        'defly-wallet-connect-modal-desktop-mode'
      );

      if (modalDesktopMode) {
        modalDesktopMode.classList.add('defly-wallet-connect-modal-desktop-mode--default');

        modalDesktopMode.classList.remove(
          'defly-wallet-connect-modal-desktop-mode--download'
        );
      }
    }
  }

}
