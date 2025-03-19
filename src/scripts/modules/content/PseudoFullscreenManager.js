import storage from '../common/storage.js';
import BaseManager from './BaseManager.js';
import fullScreenObserver from './helpers/FullScreenObserver.js';
import MouseManager from './helpers/mouseManager.js';
import localizationKeys from '../common/localizationKeys.js';
import { getI18nMessage } from '../common/locales.js';

class PseudoFullscreenManager extends BaseManager {
  #videoElement;

  #handleEscape = null;

  #mouseManager;

  #isActive = false;

  #config = { canBePseudoFullscreen: false };

  #btnStateObj = {
    enabled: {
      html: '<span class="kino-mode-icon kino"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-30"></use><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-30"></path></svg></span>',
      title: getI18nMessage(localizationKeys.cinema_mode_enabled_title),
    },
    disabled: {
      html: '<span class="kino-mode-icon kino"><svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-98"></use><path d="m 26,13 0,10 -16,0 0,-10 z m -14,2 12,0 0,6 -12,0 0,-6 z" fill="#fff" fill-rule="evenodd" id="ytp-id-98"></path></svg></span>',
      title: getI18nMessage(localizationKeys.cinema_mode_disabled_title),
    },
  };

  #elementsToHideSelectors = [
    '.sidebar',
    '.slicknav_menu',
    '.header',
    '.logo_b',
    '.info_panel',
    '.achiv_switcher',
    '.video_plate_title',
    '.header_video',
    '.all_anime_title.aat_ep',
    '.footer',
  ];

  // #styles = `
  //   #my-player {
  //     position: fixed !important;
  //     top: 0 !important;
  //     left: 0 !important;
  //     width: 100vw !important;
  //     height: 100vh !important;
  //     z-index: 9999 !important;
  //     background-color: black !important;
  //     outline: none !important;
  //   }
  //   .hidden { display: none !important; }
  // `;

  #styles = `
    .hidden { display: none; }
    #my-player {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      width: 100dvw !important;
      height: 100dvh !important;
      z-index: 9999 !important;
      background-color: black !important;
      outline: none !important;
      padding: 1vh 0 !important;

    }
  `;

  constructor(videoElement) {
    super();
    this.#videoElement = videoElement;
    this.elementsToHide = this.#elementsToHideSelectors.map((selector) =>
      document.querySelector(selector)
    );
    this.#mouseManager = new MouseManager(videoElement);
  }

  async start() {
    this.#createKinoToggleButton();
    this.#isActive = await this.loadStatusPseudoFullscreen();

    this.setBtnState(this.#isActive);

    fullScreenObserver.subscribe(this.#onFullScreenChange);

    if (this.#isActive) {
      this.#activate();
    }
  }

  update() {
    fullScreenObserver.unsubscribe(this.#onFullScreenChange);
    // console.log('update kino');
  }

  toggle() {
    this.#isActive = !this.#isActive;

    if (this.#isActive) {
      this.#activate();
    } else {
      this.#deactivate();
    }

    this.saveStatusPseudoFullscreen(this.#isActive);
  }

  async saveStatusPseudoFullscreen(status) {
    await storage.setLocalItem('pseudoFullscreenIsActive', status);
  }

  async loadStatusPseudoFullscreen() {
    const data = await storage.getLocalItem('pseudoFullscreenIsActive');
    // console.log('data', data);

    return data !== undefined ? data : false;
  }

  #activate() {
    if (fullScreenObserver.isFullScreen) {
      document.exitFullscreen();
    }

    this.#mouseManager.enable();

    this.#applyStyles();
    this.elementsToHide.forEach((el) => el?.classList.add('hidden'));
    this.setBtnState(true);

    this.#handleEscape = (event) => {
      if (event.key === 'Escape' && this.#isActive) {
        this.toggle();
      }
    };
    document.addEventListener('keydown', this.#handleEscape);
  }

  #deactivate() {
    this.#removeStyles();
    this.elementsToHide.forEach((el) => el?.classList.remove('hidden'));
    this.setBtnState(false);
    this.#scrollToPlayer();
    this.#mouseManager.disable();

    if (this.#handleEscape) {
      document.removeEventListener('keydown', this.#handleEscape);
      this.#handleEscape = null;
    }
  }

  disable() {
    fullScreenObserver.unsubscribe(this.#onFullScreenChange);
    this.removeBtn();
    this.#deactivate();
  }

  #applyStyles() {
    if (!document.getElementById('pseudo-fullscreen-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'pseudo-fullscreen-styles';
      styleEl.innerHTML = this.#styles;
      document.head.appendChild(styleEl);
    }
  }

  #removeStyles() {
    document.getElementById('pseudo-fullscreen-styles')?.remove();
  }

  #scrollToPlayer() {
    this.#videoElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setBtnState(state) {
    const kinoToggleBtn = document.querySelector('.vjs-kino-toggle');
    if (kinoToggleBtn) {
      kinoToggleBtn.innerHTML = state
        ? this.#btnStateObj.disabled.html
        : this.#btnStateObj.enabled.html;
      kinoToggleBtn.title = state
        ? this.#btnStateObj.disabled.title
        : this.#btnStateObj.enabled.title;
    }
  }

  #createKinoToggleButton() {
    const controlBar = document.querySelector('.vjs-control-bar');
    if (!controlBar || document.querySelector('.vjs-kino-toggle')) return;

    const button = document.createElement('button');
    button.className = 'vjs-control vjs-kino-toggle';
    button.innerHTML = this.#btnStateObj.enabled.html;
    button.title = 'Toggle cinema mode';
    button.addEventListener('click', () => this.toggle());

    controlBar.appendChild(button);
  }

  removeBtn() {
    const controlBar = document.querySelector('.vjs-control-bar');
    if (!controlBar || !document.querySelector('.vjs-kino-toggle')) return;
    document.querySelector('.vjs-kino-toggle').remove();
  }

  #onFullScreenChange = (isFullScreen) => {
    if (isFullScreen) {
      if (this.#isActive) {
        this.#deactivate();
        this.#isActive = !this.#isActive;
        this.saveStatusPseudoFullscreen(this.#isActive);
      }
    }
  };
}

export default PseudoFullscreenManager;
