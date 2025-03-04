import BaseManager from './BaseManager.js';
import { getI18nMessage } from '../common/locales.js';
import fullScreenObserver from './helpers/FullScreenObserver.js';

class ClickToFullScreenManager extends BaseManager {
  #isFullScreenBtnCanBeClick = true;

  locales = {
    exit: getI18nMessage('exit'),
    fullScreen: getI18nMessage('fullScreen'),
  };

  #videoElement;

  #overlayDiv = null;

  constructor(videoElement) {
    super();
    this.#videoElement = videoElement;
  }

  start() {
    if (this.#isFullScreenBtnCanBeClick) this.#createOverlay();
    fullScreenObserver.subscribe(this.#onFullScreenChange);
  }

  getStateCanBeClick() {
    return this.#isFullScreenBtnCanBeClick;
  }

  update() {
    fullScreenObserver.unsubscribe(this.#onFullScreenChange);
    // console.log('update ClickToFullScreen');
  }

  disable() {
    fullScreenObserver.unsubscribe(this.#onFullScreenChange);
    this.#removeOverlay();
  }

  #removeOverlay() {
    if (this.#overlayDiv) {
      this.#overlayDiv.remove();
      this.#overlayDiv = null;
    }
    document.removeEventListener('fullscreenchange', this.#onFullScreenChange);
  }

  #createOverlay() {
    if (this.#overlayDiv) return;

    this.#overlayDiv = document.createElement('div');
    this.#overlayDiv.className = 'extension-overlay-div';
    document.body.appendChild(this.#overlayDiv);

    const fullScreenBtn = this.#createButton(
      this.locales.fullScreen,
      'extension-overlay-button',
      this.#goFullScreen.bind(this)
    );

    const exitBtn = this.#createButton(
      this.locales.exit,
      'extension-overlay-exit-button',
      this.#closeOverlay.bind(this)
    );

    this.#overlayDiv.append(fullScreenBtn, exitBtn);

    document.addEventListener('fullscreenchange', this.#onFullScreenChange);
  }

  #createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.onclick = onClick;
    return button;
  }

  #goFullScreen() {
    const fullScreenControl = document.querySelector('.vjs-fullscreen-control');
    if (fullScreenControl) {
      fullScreenControl.classList.remove('vjs-hidden');
      fullScreenControl.click();
    }
    // this.#isFullScreenBtnCanBeClick = false;
    this.#closeOverlay();
  }

  #closeOverlay() {
    this.#removeOverlay();
    this.#isFullScreenBtnCanBeClick = false;
    this.#videoElement.focus();
  }

  #onFullScreenChange = (isFullScreen) => {
    if (isFullScreen) return;
    this.#closeOverlay();
  };
}

export default ClickToFullScreenManager;
