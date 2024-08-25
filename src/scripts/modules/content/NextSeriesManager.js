// NextSeriesManager.js

class NextSeriesManager {
  #videoElement;
  #intervalIds = [];

  constructor(videoElement) {
    this.#videoElement = videoElement;
  }

  nextSeriesBeforeEnd(nextSerBtn) {
    this.disable();
    const checkVideoEnded = setInterval(() => {
      if (
        this.#videoElement.ended ||
        !nextSerBtn.classList.contains("vjs-hidden")
      ) {
        clearInterval(checkVideoEnded);
        nextSerBtn.click();
      }
    }, 1000);
    this.#intervalIds.push(checkVideoEnded);
  }

  nextSeriesAfterEnd(nextSerBtn) {
    this.disable();
    const checkVideoEnded = setInterval(() => {
      if (this.#videoElement.ended) {
        clearInterval(checkVideoEnded);
        nextSerBtn.click();
      }
    }, 1000);
    this.#intervalIds.push(checkVideoEnded);
  }

  disable() {
    this.#intervalIds.forEach(clearInterval);
    this.#intervalIds = [];
  }
}

export default NextSeriesManager;
