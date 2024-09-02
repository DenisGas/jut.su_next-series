import BaseManager from './BaseManager.js';

class PseudoFullscreenManager extends BaseManager{
  #videoElement;
  #isActive = false;
  #styles = `
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
    .hidden { display: none !important; }
  `;

  constructor(videoElement, elementsToHideSelectors) {
    super();
    this.videoElement = videoElement;
    this.elementsToHide = elementsToHideSelectors.map(selector => document.querySelector(selector));
  }

  toggle() {
    this.#isActive = !this.#isActive;
    if (this.#isActive) {
      this.#activate();
    } else {
      this.#deactivate();
    }
  }

  #activate() {
    this.#applyStyles();
    this.elementsToHide.forEach(el => el.classList.add('hidden'));
    // this.videoElement.classList.add('pseudo-fullscreen');
  }

  #deactivate() {
    this.#removeStyles();
    this.elementsToHide.forEach(el => el.classList.remove('hidden'));
    // this.videoElement.classList.remove('pseudo-fullscreen');
  }

  #applyStyles() {
    let styleEl = document.getElementById('pseudo-fullscreen-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'pseudo-fullscreen-styles';
      styleEl.innerHTML = this.#styles;
      document.head.appendChild(styleEl);
    }
  }

  #removeStyles() {
    const styleEl = document.getElementById('pseudo-fullscreen-styles');
    if (styleEl) {
      styleEl.remove();
    }
  }

  #scrollToPlayer() {
    const player = document.getElementById('my-player');
    if (player) {
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    }

    start(){
      this.#activate()
    }

    update(){
      this.disable();
    }

    disable() {
      this.#deactivate();
      this.#scrollToPlayer();
  
      // this.#removePseudoFullscreenToggle();
      // this.#saveCanBePseudoFullscreen(false);
    }
  }




// class PseudoFullscreenManager {
//     #videoElement;
//     #config;
  
//     constructor(videoElement, config) {
//       this.#videoElement = videoElement;
//       this.#config = { ...config };
//       this.#init();
//     }
  
//     async #init() {
//       return
//     }

  
//     #scrollToPlayer() {
//       if (this.#videoElement) {
//         this.#videoElement.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//     }
  
//     disable() {
//       // this.scrollToPlayer();
//       // this.#deactivatePseudoFullscreen();
//       // this.#removePseudoFullscreenToggle();
//       // this.#saveCanBePseudoFullscreen(false);
//     }
  
//   }
  
  export default PseudoFullscreenManager;
  