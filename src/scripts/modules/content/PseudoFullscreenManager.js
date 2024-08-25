class PseudoFullscreenManager {
    #videoElement;
    #config;
  
    constructor(videoElement, config) {
      this.#videoElement = videoElement;
      this.#config = { ...config };
      this.#init();
    }
  
    async #init() {
      return
    }

  
    #scrollToPlayer() {
      if (this.#videoElement) {
        this.#videoElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  
    disable() {
      // this.scrollToPlayer();
      // this.#deactivatePseudoFullscreen();
      // this.#removePseudoFullscreenToggle();
      // this.#saveCanBePseudoFullscreen(false);
    }
  
  }
  
  export default PseudoFullscreenManager;
  